#!/usr/bin/env node

/**
 * Main build script for pp-app
 * Builds both web2 and web3 targets by calling separate build scripts
 */

import fs from 'fs';
import {execSync} from 'child_process';

const WORK_DIR = 'obj';

/**
 * Main build function - builds both web2 and web3
 */
async function build() {
  console.log('Starting build process...');

  // 1. Reset workdir
  if (fs.existsSync(WORK_DIR)) {
    fs.rmSync(WORK_DIR, {recursive : true, force : true});
  }
  fs.mkdirSync(WORK_DIR, {recursive : true});

  // 2. Build web2 and web3 separately by calling their build scripts
  console.log('Building web2...');
  execSync('node build2.js', {stdio: 'inherit'});
  
  console.log('Building web3...');
  execSync('node build3.js', {stdio: 'inherit'});

  console.log('[SUCCESS] Build completed successfully!');
  console.log(`Output directories: dist/web2, dist/web3`);
}

// Run build
build().catch(error => {
  console.error('[ERROR] Build failed:', error);
  process.exit(1);
});
