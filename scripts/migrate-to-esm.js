#!/usr/bin/env node

/**
 * Script to migrate IIFE files to ES modules
 * Converts (function(namespace) { ... namespace.Export = Export; }(window.namespace = window.namespace || {}));
 * to ES module exports with backward compatibility
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function migrateFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already migrated (has export)
  if (content.includes('export ') && !content.match(/^\(function\(/)) {
    return false; // Already migrated
  }
  
  // Check if it's an IIFE pattern
  const iifeMatch = content.match(/^\(function\(([a-zA-Z_$][a-zA-Z0-9_$]*)\)\s*\{/);
  if (!iifeMatch) {
    return false; // Not an IIFE pattern
  }
  
  const namespace = iifeMatch[1];
  let newContent = content;
  
  // Remove opening IIFE
  newContent = newContent.replace(/^\(function\([a-zA-Z_$][a-zA-Z0-9_$]*\)\s*\{/, '');
  
  // Find and convert namespace assignments to exports
  // Pattern: namespace.ExportName = ExportName;
  const exportPattern = new RegExp(`^(${namespace}\\.([A-Z_][A-Z0-9_]*)\\s*=\\s*[^;]+;)\\s*`, 'gm');
  const exports = [];
  const exportMap = new Map();
  
  // Find all namespace assignments before the closing IIFE
  const closingMatch = newContent.match(/\}(window\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*=\s*window\.[a-zA-Z_$][a-zA-Z0-9_$]*\s*\|\|\s*\{\})\s*\)\s*;?\s*$/);
  if (!closingMatch) {
    console.error(`Could not find closing pattern in ${filePath}`);
    return false;
  }
  
  // Extract content before closing
  const beforeClose = newContent.substring(0, closingMatch.index);
  const lines = beforeClose.split('\n');
  
  // Find namespace assignments
  for (let i = lines.length - 1; i >= 0; i--) {
    const line = lines[i];
    const match = line.match(new RegExp(`${namespace}\\.([A-Z_$][A-Z0-9_$]*)\\s*=\\s*([A-Z_$][A-Z0-9_$]*);`));
    if (match) {
      const exportName = match[2];
      const constName = match[1];
      
      // Check if it's a constant (uppercase) or class
      if (constName === exportName) {
        if (constName.match(/^[A-Z_][A-Z0-9_]*$/)) {
          // Likely a constant
          exportMap.set(i, { type: 'const', name: constName });
        } else {
          // Likely a class
          exportMap.set(i, { type: 'class', name: exportName });
        }
      }
    }
  }
  
  // This is getting complex. Let me use a simpler approach - manual conversion
  return false; // Return false to indicate manual conversion needed
}

// For now, let's do manual conversion systematically
console.log('Migration script placeholder - using manual conversion');
