#!/usr/bin/env node

/**
 * Batch migrate IIFE files to ES modules
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const originalContent = content;
  
  // Skip if already migrated
  if (content.includes('export ') && !content.match(/^\(function\(/)) {
    return { migrated: false, reason: 'already migrated' };
  }
  
  // Check if it's an IIFE pattern
  const iifeMatch = content.match(/^\(function\(([a-zA-Z_$][a-zA-Z0-9_$]*)\)\s*\{/);
  if (!iifeMatch) {
    return { migrated: false, reason: 'not IIFE pattern' };
  }
  
  const namespace = iifeMatch[1];
  
  // Remove opening IIFE
  content = content.replace(/^\(function\([a-zA-Z_$][a-zA-Z0-9_$]*\)\s*\{/, '');
  
  // Find closing pattern
  const closingPattern = new RegExp(`\\}(window\\.${namespace}\\s*=\\s*window\\.${namespace}\\s*\\|\\|\\s*\\{\\})\\s*\\)\\s*;?\\s*$`);
  if (!closingPattern.test(content)) {
    return { migrated: false, reason: 'closing pattern not found' };
  }
  
  // Extract namespace assignments before closing
  const beforeClose = content.replace(closingPattern, '');
  const lines = beforeClose.split('\n');
  
  // Find all namespace.Export = Export; patterns
  const exports = [];
  const constExports = [];
  
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i].trim();
    // Pattern: namespace.Name = Name;
    const match = line.match(new RegExp(`^${namespace}\\.([A-Z_$][A-Z0-9_$]*)\\s*=\\s*([A-Z_$][A-Z0-9_$]*);?$`));
    if (match) {
      const constName = match[1];
      const exportName = match[2];
      
      if (constName === exportName) {
        // Check if it's a constant (all caps) or class
        if (constName.match(/^[A-Z_][A-Z0-9_]*$/)) {
          constExports.push({ name: constName, line: i });
        } else {
          exports.push({ name: exportName, line: i });
        }
      }
    }
  }
  
  // Remove namespace assignment lines
  for (const exp of [...exports, ...constExports]) {
    const lineIndex = exp.line;
    const linePattern = new RegExp(`^\\s*${namespace}\\.${exp.name}\\s*=\\s*${exp.name};?\\s*$`, 'gm');
    content = content.replace(linePattern, '');
  }
  
  // Add export statements
  let exportStatements = [];
  
  // Find constants defined as namespace.NAME = {...}
  const constDefPattern = new RegExp(`^\\s*${namespace}\\.([A-Z_][A-Z0-9_]*)\\s*=\\s*\\{`, 'gm');
  let constDefMatch;
  while ((constDefMatch = constDefPattern.exec(content)) !== null) {
    const constName = constDefMatch[1];
    // Replace namespace.NAME = with export const NAME =
    content = content.replace(
      new RegExp(`^\\s*${namespace}\\.${constName}\\s*=\\s*`, 'gm'),
      `export const ${constName} = `
    );
    constExports.push({ name: constName });
  }
  
  // Add export for classes
  for (const exp of exports) {
    // Find class definition
    const classPattern = new RegExp(`^class\\s+${exp.name}\\s+`, 'm');
    if (classPattern.test(content)) {
      content = content.replace(classPattern, `export class ${exp.name} `);
    }
  }
  
  // Remove closing IIFE
  content = content.replace(closingPattern, '');
  
  // Add backward compatibility
  const compatExports = [...exports.map(e => e.name), ...constExports.map(e => e.name)];
  if (compatExports.length > 0) {
    const compatCode = `
// Backward compatibility
if (typeof window !== 'undefined') {
  window.${namespace} = window.${namespace} || {};
${compatExports.map(name => `  window.${namespace}.${name} = ${name};`).join('\n')}
}`;
    content = content.trim() + compatCode;
  }
  
  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    return { migrated: true, exports: compatExports };
  }
  
  return { migrated: false, reason: 'no changes' };
}

async function main() {
  const files = await glob('app/sectors/**/*.js', { cwd: path.join(__dirname, '..') });
  
  let migrated = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const file of files) {
    const filePath = path.join(__dirname, '..', file);
    try {
      const result = await migrateFile(filePath);
      if (result.migrated) {
        migrated++;
        console.log(`✓ Migrated: ${file}`);
      } else {
        skipped++;
      }
    } catch (error) {
      errors++;
      console.error(`✗ Error migrating ${file}:`, error.message);
    }
  }
  
  console.log(`\nMigration complete:`);
  console.log(`  Migrated: ${migrated}`);
  console.log(`  Skipped: ${skipped}`);
  console.log(`  Errors: ${errors}`);
}

main().catch(console.error);
