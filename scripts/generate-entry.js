#!/usr/bin/env node

/**
 * Generate entry point files from file_list.txt
 * Creates ES module imports for all files in the correct order
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function generateEntryPoint(listFile, outputFile, baseDir = 'app') {
  const fileList = fs.readFileSync(listFile, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  const imports = [];
  imports.push(`// Auto-generated entry point from ${path.basename(listFile)}`);
  imports.push(`// Generated at ${new Date().toISOString()}\n`);

  for (const file of fileList) {
    const filePath = path.join(baseDir, file);
    // Convert to ES module import path (relative to src/)
    const importPath = `../${filePath}`;
    imports.push(`import '../${filePath}';`);
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, imports.join('\n') + '\n');
  console.log(`Generated ${outputFile} with ${fileList.length} imports`);
}

// Generate main app entry point
generateEntryPoint('app/file_list.txt', 'src/index.js', 'app');

// Generate service worker entry point
generateEntryPoint('sw/file_list.txt', 'src/sw.js', 'sw');
