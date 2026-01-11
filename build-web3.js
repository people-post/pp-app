#!/usr/bin/env node

/**
 * Build script for web3 target only
 * Uses esbuild (same as original build.js)
 */

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORK_DIR = 'obj';
const ENTRY_APP_JS = 'src/app.ts';
const BUNDLE_JS_PATH = path.join(WORK_DIR, 'app.js');
const OUTPUT_DIR = 'dist/web3';

/**
 * Bundle JavaScript using esbuild
 * @param {string} entryPoint - Entry point file
 * @param {string} outputFile - Output bundled file
 * @param {object} options - Additional esbuild options
 */
async function bundleJs(entryPoint, outputFile, options = {}) {
  console.log(`Bundling ${entryPoint}...`);

  const result = await esbuild.build({
    entryPoints : [ entryPoint ],
    bundle : true,
    minify : true,
    sourcemap : true,
    platform : 'browser',
    format : 'iife',
    outfile : outputFile,
    // Enable TypeScript support for node_modules (pp-api uses TypeScript)
    loader : {'.ts' : 'ts', '.tsx' : 'tsx'},
    // Ensure window refers to the global window object
    define : {'window' : 'window'},
    ...options
  });

  if (result.errors.length > 0) {
    throw new Error(
        `esbuild errors: ${result.errors.map(e => e.text).join(', ')}`);
  }

  console.log(`[SUCCESS] Bundled ${entryPoint} -> ${outputFile}`);
}

/**
 * Minify CSS file using esbuild
 * @param {string} inputFile - Input CSS file
 * @param {string} outputFile - Output minified CSS file
 */
async function minifyCss(inputFile, outputFile) {
  try {
    const result = await esbuild.build({
      entryPoints : [ inputFile ],
      bundle : false,
      minify : true,
      loader : {'.css' : 'css'},
      outfile : outputFile
    });

    if (result.errors.length > 0) {
      throw new Error(
          `esbuild errors: ${result.errors.map(e => e.text).join(', ')}`);
    }

    console.log(`[SUCCESS] Minified CSS: ${inputFile} -> ${outputFile}`);
  } catch (error) {
    console.error(`Error minifying CSS: ${error.message}`);
    throw error;
  }
}

/**
 * Main build function for web3
 */
async function buildWeb3() {
  console.log('Starting web3 build process...');

  // 1. Create temp workdir
  if (fs.existsSync(WORK_DIR)) {
    fs.rmSync(WORK_DIR, {recursive : true, force : true});
  }
  fs.mkdirSync(WORK_DIR, {recursive : true});

  // 2. Bundle JavaScript using esbuild
  await bundleJs(ENTRY_APP_JS, BUNDLE_JS_PATH);

  // 3. Prepare css
  console.log('Minifying CSS...');
  const cssInputFile = 'css/hst.css';
  const cssOutputFile = path.join(WORK_DIR, 'hst-min.css');
  await minifyCss(cssInputFile, cssOutputFile);

  // 4. Prepare web3 files in dist/web3
  const WEB3_DIR = OUTPUT_DIR;
  if (fs.existsSync(WEB3_DIR)) {
    fs.rmSync(WEB3_DIR, {recursive : true, force : true});
  }
  fs.mkdirSync(path.join(WEB3_DIR, 'user'), {recursive : true});
  fs.mkdirSync(path.join(WEB3_DIR, 'static'), {recursive : true});
  fs.copyFileSync('html/web3.html', path.join(WEB3_DIR, 'index.html'));
  fs.copyFileSync(cssOutputFile, path.join(WEB3_DIR, 'static', 'app.css'));
  fs.copyFileSync(BUNDLE_JS_PATH, path.join(WEB3_DIR, 'static', 'app.js'));
  fs.copyFileSync(BUNDLE_JS_PATH + '.map',
                  path.join(WEB3_DIR, 'static', 'app.js.map'));
  fs.copyFileSync('configs/web3_config.js',
                  path.join(WEB3_DIR, 'user', 'config.js'));
  fs.copyFileSync('configs/web3_config_example.js',
                  path.join(WEB3_DIR, 'user', 'config.js.bak'));
  fs.copyFileSync('ext/cardano.min.js',
                  path.join(WEB3_DIR, 'static', 'cardano-min.js'));

  // 5. Cleanup temp workdir
  fs.rmSync(WORK_DIR, {recursive : true, force : true});

  console.log('[SUCCESS] Web3 build completed successfully!');
  console.log(`Output directory: ${OUTPUT_DIR}`);
}

// Run build
buildWeb3().catch(error => {
  console.error('[ERROR] Web3 build failed:', error);
  process.exit(1);
});
