#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Skip if already migrated
  if (content.includes('export ') && !content.match(/^\(function\(/)) {
    return false;
  }
  
  // Match IIFE pattern
  const iifeMatch = content.match(/^\(function\(([a-zA-Z_$][a-zA-Z0-9_$]*)\)\s*\{/);
  if (!iifeMatch) return false;
  
  const namespace = iifeMatch[1];
  
  // Remove opening IIFE
  content = content.replace(/^\(function\([a-zA-Z_$][a-zA-Z0-9_$]*\)\s*\{/, '');
  
  // Find closing pattern - more flexible, handle various formats
  const closingPatterns = [
    new RegExp(`\\}(window\\.${namespace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*=\\s*window\\.${namespace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\|\\|\\s*\\{\\})\\s*\\)\\s*;?\\s*$`),
    new RegExp(`\\}(window\\.${namespace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*=\\s*window\\.${namespace.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*\\|\\|\\s*\\{\\})\\s*\\)\\s*;?\\s*\\n?\\s*$`),
  ];
  
  let closingRegex = null;
  for (const pattern of closingPatterns) {
    if (pattern.test(content)) {
      closingRegex = pattern;
      break;
    }
  }
  
  if (!closingRegex && !content.includes(`}(window.${namespace}`)) {
    // Try simpler pattern match
    const simpleMatch = content.match(new RegExp(`\\}(window\\.${namespace}[^}]*\\)\\);?\\s*$`));
    if (simpleMatch) {
      closingRegex = new RegExp(simpleMatch[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*$');
    }
  }
  
  if (!closingRegex) {
    console.error(`  ⚠ Could not find closing pattern in ${filePath}`);
    return false;
  }
  
  // Extract exports before closing
  const beforeClose = content.replace(closingRegex, '');
  
  // Find namespace.NAME = NAME; patterns
  const exportPattern = new RegExp(`^\\s*${namespace}\\.([A-Z_$][A-Z0-9_$]*)\\s*=\\s*\\1;?\\s*$`, 'gm');
  const exports = [];
  let match;
  while ((match = exportPattern.exec(beforeClose)) !== null) {
    exports.push(match[1]);
  }
  
  // Find namespace.NAME = {...} patterns (constants)
  const constPattern = new RegExp(`^\\s*${namespace}\\.([A-Z_][A-Z0-9_]*)\\s*=\\s*\\{`, 'gm');
  const constants = [];
  while ((match = constPattern.exec(beforeClose)) !== null) {
    constants.push(match[1]);
  }
  
  // Remove namespace assignment lines
  for (const exp of [...exports, ...constants]) {
    const linePattern = new RegExp(`^\\s*${namespace}\\.${exp}\\s*=\\s*${exp};?\\s*$`, 'gm');
    content = content.replace(linePattern, '');
  }
  
  // Convert constants: namespace.NAME = {...} to export const NAME = {...}
  for (const constName of constants) {
    const constDefPattern = new RegExp(`^\\s*${namespace}\\.${constName}\\s*=\\s*`, 'gm');
    content = content.replace(constDefPattern, `export const ${constName} = `);
  }
  
  // Convert classes: class Name to export class Name
  for (const exp of exports) {
    // Only convert if it's a class (not a constant)
    if (!constants.includes(exp)) {
      const classPattern = new RegExp(`^class\\s+${exp}\\s+`, 'm');
      if (classPattern.test(content)) {
        content = content.replace(classPattern, `export class ${exp} `);
      }
    }
  }
  
  // Remove closing IIFE
  content = content.replace(closingRegex, '');
  
  // Add backward compatibility
  const allExports = [...new Set([...exports, ...constants])];
  if (allExports.length > 0) {
    const compatCode = `\n\n// Backward compatibility\nif (typeof window !== 'undefined') {\n  window.${namespace} = window.${namespace} || {};\n${allExports.map(name => `  window.${namespace}.${name} = ${name};`).join('\n')}\n}`;
    content = content.trim() + compatCode;
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  }
  
  return false;
}

// Get all JS files in sectors
const sectorsDir = path.join(__dirname, '..', 'app', 'sectors');
const files = execSync(`find "${sectorsDir}" -name "*.js" -type f`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(f => f);

let migrated = 0;
let skipped = 0;
let errors = 0;

console.log(`Found ${files.length} files to check...\n`);

for (const file of files) {
  try {
    if (migrateFile(file)) {
      migrated++;
      const relPath = path.relative(path.join(__dirname, '..'), file);
      console.log(`✓ ${relPath}`);
    } else {
      skipped++;
    }
  } catch (error) {
    errors++;
    const relPath = path.relative(path.join(__dirname, '..'), file);
    console.error(`✗ ${relPath}: ${error.message}`);
  }
}

console.log(`\nMigration complete:`);
console.log(`  Migrated: ${migrated}`);
console.log(`  Skipped: ${skipped}`);
console.log(`  Errors: ${errors}`);
