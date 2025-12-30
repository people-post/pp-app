#!/usr/bin/env node

import fs from 'fs';
import { execSync } from 'child_process';

const sectorsDir = 'app/sectors';
const files = execSync(`find "${sectorsDir}" -name "*.js" -type f`, { encoding: 'utf-8' })
  .trim()
  .split('\n')
  .filter(f => f);

let fixed = 0;

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const original = content;
  
  // Check if file ends with IIFE closing pattern
  if (!content.includes('}(window.')) continue;
  
  // Find namespace from the closing pattern
  const lines = content.split('\n');
  let namespace = null;
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const match = line.match(/}(window\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*window\.\1\s*\|\|\s*\{\})\s*\)\s*;?/);
    if (match) {
      namespace = match[1];
      // Remove this line
      lines.splice(i, 1);
      break;
    }
    // Try without backreference
    const altMatch = line.match(/}(window\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=\s*window\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\|\|\s*\{\})\s*\)\s*;?/);
    if (altMatch && altMatch[2] === altMatch[3]) {
      namespace = altMatch[2];
      lines.splice(i, 1);
      break;
    }
  }
  
  if (!namespace) continue;
  
  content = lines.join('\n');
  
  // Find class name
  const classMatch = content.match(/^class\s+([A-Z_$][A-Z0-9_$]*)\s+/m);
  if (classMatch) {
    const className = classMatch[1];
    
    // Add export
    content = content.replace(/^class\s+([A-Z_$][A-Z0-9_$]*)\s+/m, 'export class $1 ');
    
    // Remove namespace assignment line
    const assignPattern = new RegExp(`^\\s*${namespace}\\.${className}\\s*=\\s*${className};?\\s*$`, 'gm');
    content = content.replace(assignPattern, '');
    
    // Add backward compatibility if not present
    if (!content.includes('// Backward compatibility')) {
      content = content.trim() + `\n\n// Backward compatibility\nif (typeof window !== 'undefined') {\n  window.${namespace} = window.${namespace} || {};\n  window.${namespace}.${className} = ${className};\n}`;
    }
  }
  
  // Handle constants
  const constMatch = content.match(new RegExp(`^\\s*${namespace}\\.([A-Z_][A-Z0-9_]*)\\s*=\\s*\\{`, 'm'));
  if (constMatch) {
    const constName = constMatch[1];
    content = content.replace(new RegExp(`^\\s*${namespace}\\.${constName}\\s*=\\s*`, 'm'), `export const ${constName} = `);
    content = content.replace(new RegExp(`^\\s*${namespace}\\.${constName}\\s*=\\s*${constName};?\\s*$`, 'gm'), '');
    
    if (!content.includes(`window.${namespace}.${constName}`)) {
      if (content.includes('// Backward compatibility')) {
        content = content.replace(/(\n\})/g, (match, p1, offset) => {
          const before = content.substring(0, offset);
          if (before.includes('// Backward compatibility') && !before.includes(`window.${namespace}.${constName}`)) {
            return `\n  window.${namespace}.${constName} = ${constName};${p1}`;
          }
          return match;
        });
      } else {
        content = content.trim() + `\n\n// Backward compatibility\nif (typeof window !== 'undefined') {\n  window.${namespace} = window.${namespace} || {};\n  window.${namespace}.${constName} = ${constName};\n}`;
      }
    }
  }
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf-8');
    fixed++;
    const relPath = filePath.replace(process.cwd() + '/', '');
    console.log(`✓ ${relPath}`);
  }
}

console.log(`\nFixed ${fixed} files`);
