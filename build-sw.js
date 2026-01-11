#!/usr/bin/env node

/**
 * Build script for service worker
 * Uses esbuild to bundle the service worker separately
 */

import { build } from 'esbuild';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { mkdirSync, copyFileSync, existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function buildServiceWorker() {
  console.log('Building service worker...');

  // Build service worker for web2
  const web2SwOut = resolve(__dirname, 'dist/web2/static/js/sw-min.js');
  const web2SwOutDir = resolve(__dirname, 'dist/web2/static/js');
  
  if (!existsSync(web2SwOutDir)) {
    mkdirSync(web2SwOutDir, { recursive: true });
  }

  await build({
    entryPoints: [resolve(__dirname, 'src/sw.ts')],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'browser',
    format: 'esm',
    outfile: web2SwOut,
    target: 'es2022'
  });

  console.log('[SUCCESS] Service worker built for web2');
}

buildServiceWorker().catch(error => {
  console.error('[ERROR] Service worker build failed:', error);
  process.exit(1);
});
