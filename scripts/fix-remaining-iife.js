#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const sectorsDir = path.join(process.cwd(), 'app', 'sectors');
const files = execSync(`find "${sectorsDir}" -name "*.js" -type f`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(f => f);

let fixed = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Check if file has closing IIFE pattern - handle multiline
  const closingMatch = content.match(/}(window\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*window\.\2\s*\|\|\s*\{\})\s*\)\s*;?\s*$/);
  if (!closingMatch) {
    // Try matching across newlines
    const altMatch = content.match(/}(window\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*window\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*\|\|\s*\{\})\s*\)\s*;?\s*$/);
    if (!altMatch) continue;
  }
  
  let namespace;
  if (closingMatch) {
    namespace = closingMatch[2];
  } else {
    const altMatch = content.match(/}(window\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*window\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\|\|\s*\{\})\s*\)\s*;?\s*$/);
    if (!altMatch) continue;
    namespace = altMatch[2] || altMatch[3];
  }
  
  // Remove closing IIFE - match end of file
  content = content.replace(new RegExp(`}(window\\.${namespace}\\s*=\\s*window\\.${namespace}\\s*\\|\\|\\s*\\{\\})\\s*\\)\\s*;?\\s*$`), '');
  
  // Find class name
  const classMatch = content.match(/^class\s+([A-Z_$][A-Z0-9_$]*)\s+/m);
  if (classMatch) {
    const className = classMatch[1];
    
    // Add export
    content = content.replace(/^class\s+([A-Z_$][A-Z0-9_$]*)\s+/m, 'export class $1 ');
    
    // Remove namespace assignment
    content = content.replace(new RegExp(`^\\s*${namespace}\\.${className}\\s*=\\s*${className};?\\s*$`, 'gm'), '');
    
    // Add backward compatibility if not already present
    if (!content.includes('// Backward compatibility')) {
      const compatCode = `\n\n// Backward compatibility\nif (typeof window !== 'undefined') {\n  window.${namespace} = window.${namespace} || {};\n  window.${namespace}.${className} = ${className};\n}`;
      content = content.trim() + compatCode;
    }
  }
  
  // Handle constants
  const constMatch = content.match(new RegExp(`^\\s*${namespace}\\.([A-Z_][A-Z0-9_]*)\\s*=\\s*\\{`, 'm'));
  if (constMatch) {
    const constName = constMatch[1];
    content = content.replace(new RegExp(`^\\s*${namespace}\\.${constName}\\s*=\\s*`, 'm'), `export const ${constName} = `);
    content = content.replace(new RegExp(`^\\s*${namespace}\\.${constName}\\s*=\\s*${constName};?\\s*$`, 'gm'), '');
    
    if (!content.includes(`window.${namespace}.${constName}`)) {
      const compatMatch = content.match(/\/\/ Backward compatibility[\s\S]*?\n\}/);
      if (compatMatch) {
        content = content.replace(compatMatch[0], compatMatch[0].replace(/\n\}$/, `\n  window.${namespace}.${constName} = ${constName};\n}`));
      } else {
        const compatCode = `\n\n// Backward compatibility\nif (typeof window !== 'undefined') {\n  window.${namespace} = window.${namespace} || {};\n  window.${namespace}.${constName} = ${constName};\n}`;
        content = content.trim() + compatCode;
      }
    }
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    fixed++;
    const relPath = path.relative(process.cwd(), filePath);
    console.log(`✓ Fixed: ${relPath}`);
  }
}

console.log(`\nFixed ${fixed} files`);
