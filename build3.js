#!/usr/bin/env node

/**
 * Build script for web3 target
 */

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import {execSync} from 'child_process';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORK_DIR = 'obj';
const ENTRY_APP_JS = 'src/app.ts';

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
 * Build web3 target
 */
async function buildWeb3() {
  console.log('Starting web3 build...');

  // Create web3 work directory
  const WEB3_WORK_DIR = path.join(WORK_DIR, 'web3-temp');
  if (fs.existsSync(WEB3_WORK_DIR)) {
    fs.rmSync(WEB3_WORK_DIR, {recursive : true, force : true});
  }
  fs.mkdirSync(WEB3_WORK_DIR, {recursive : true});

  // Bundle JavaScript for web3
  const WEB3_BUNDLE_JS_PATH = path.join(WEB3_WORK_DIR, 'app.js');
  await bundleJs(ENTRY_APP_JS, WEB3_BUNDLE_JS_PATH);

  // Minify CSS for web3
  console.log('Minifying CSS for web3...');
  const cssInputFile = 'css/hst.css';
  const cssOutputFile = path.join(WEB3_WORK_DIR, 'app.css');
  await minifyCss(cssInputFile, cssOutputFile);

  // Prepare web3 output directory
  const WEB3_DIR = path.join('dist', 'web3');
  if (fs.existsSync(WEB3_DIR)) {
    fs.rmSync(WEB3_DIR, {recursive : true, force : true});
  }
  fs.mkdirSync(path.join(WEB3_DIR, 'user'), {recursive : true});
  fs.mkdirSync(path.join(WEB3_DIR, 'static'), {recursive : true});
  
  // Copy files
  fs.copyFileSync('html/web3.html', path.join(WEB3_DIR, 'index.html'));
  fs.copyFileSync(cssOutputFile, path.join(WEB3_DIR, 'static', 'app.css'));
  fs.copyFileSync(WEB3_BUNDLE_JS_PATH, path.join(WEB3_DIR, 'static', 'app.js'));
  fs.copyFileSync(WEB3_BUNDLE_JS_PATH + '.map',
                  path.join(WEB3_DIR, 'static', 'app.js.map'));
  fs.copyFileSync('configs/web3_config.js',
                  path.join(WEB3_DIR, 'user', 'config.js'));
  fs.copyFileSync('configs/web3_config_example.js',
                  path.join(WEB3_DIR, 'user', 'config.js.bak'));
  fs.copyFileSync('ext/cardano.min.js',
                  path.join(WEB3_DIR, 'static', 'cardano-min.js'));

  // Create tarball
  console.log('Creating web3 tarball...');
  const distDirPath = path.resolve('dist');
  const tarPath = path.join(distDirPath, 'web3.tar');
  execSync(`tar -cf ${tarPath} web3`, {cwd : distDirPath});
  execSync(`gzip -f ${tarPath}`, {cwd : distDirPath});

  // Cleanup temp directory
  fs.rmSync(WEB3_WORK_DIR, {recursive : true, force : true});

  console.log('[SUCCESS] Web3 build completed!');
  console.log(`Output directory: ${WEB3_DIR}`);
  console.log(`Web3 package: ${path.join('dist', 'web3.tar.gz')}`);
}

// Run build
buildWeb3().catch(error => {
  console.error('[ERROR] Web3 build failed:', error);
  process.exit(1);
});
