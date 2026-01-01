#!/usr/bin/env node

/**
 * Build script for pp-app
 * Replaces package.sh functionality with Node.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { execSync } from 'child_process';
import * as esbuild from 'esbuild';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORK_DIR = 'obj';
const ENTRY_APP_JS = 'src/index_app.js';
const ENTRY_SW_JS = 'src/index_sw.js';
const BUNDLE_JS_PATH = path.join(WORK_DIR, 'app-min.js');
const BUNDLE_SW_PATH = path.join(WORK_DIR, 'sw-min.js');
const PP_API_BUNDLE_PATH = path.join('node_modules', 'pp-api', 'bundle.js');
const PP_API_MIN_PATH = path.join(WORK_DIR, 'pp-api-min.js');

/**
 * Bundle JavaScript using esbuild
 * @param {string} entryPoint - Entry point file
 * @param {string} outputFile - Output bundled file
 * @param {object} options - Additional esbuild options
 */
async function bundleJs(entryPoint, outputFile, options = {}) {
  console.log(`Bundling ${entryPoint}...`);
  
  const result = await esbuild.build({
    entryPoints: [entryPoint],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'browser',
    format: 'iife',
    globalName: 'window',
    outfile: outputFile,
    ...options
  });

  if (result.errors.length > 0) {
    throw new Error(`esbuild errors: ${result.errors.map(e => e.text).join(', ')}`);
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
      entryPoints: [inputFile],
      bundle: false,
      minify: true,
      loader: {
        '.css': 'css'
      },
      outfile: outputFile
    });

    if (result.errors.length > 0) {
      throw new Error(`esbuild errors: ${result.errors.map(e => e.text).join(', ')}`);
    }

    console.log(`[SUCCESS] Minified CSS: ${inputFile} -> ${outputFile}`);
  } catch (error) {
    console.error(`Error minifying CSS: ${error.message}`);
    throw error;
  }
}

/**
 * Build pp-api bundle
 */
async function buildPpApi() {
  console.log('Building pp-api bundle...');
  
  const ppApiPath = path.resolve('node_modules', 'pp-api');
  const ppApiSrc = path.join(ppApiPath, 'src', 'index.ts');
  const ppApiBundle = path.join(ppApiPath, 'bundle.js');
  
  // Check if pp-api is installed
  if (!fs.existsSync(ppApiPath)) {
    throw new Error('pp-api dependency not found. Please run: npm install');
  }
  
  // Build pp-api bundle using esbuild
  const result = await esbuild.build({
    entryPoints: [ppApiSrc],
    bundle: true,
    minify: true,
    platform: 'browser',
    format: 'iife',
    globalName: 'pp',
    outfile: ppApiBundle
  });

  if (result.errors.length > 0) {
    throw new Error(`pp-api build errors: ${result.errors.map(e => e.text).join(', ')}`);
  }

  console.log(`[SUCCESS] Built pp-api bundle -> ${ppApiBundle}`);
  
  // Copy to work directory for reference
  fs.copyFileSync(ppApiBundle, PP_API_MIN_PATH);
}

/**
 * Main build function
 */
async function build() {
  console.log('Starting build process...');

  // 1. Reset workdir
  if (fs.existsSync(WORK_DIR)) {
    fs.rmSync(WORK_DIR, { recursive: true, force: true });
  }
  fs.mkdirSync(WORK_DIR, { recursive: true });

  // 1.5. Build pp-api bundle
  await buildPpApi();

  // 2. Bundle JavaScript using esbuild
  // Bundle app js (pp-api will be imported in the entry point)
  await bundleJs(ENTRY_APP_JS, BUNDLE_JS_PATH);

  // Bundle service worker js
  await bundleJs(ENTRY_SW_JS, BUNDLE_SW_PATH, {
    platform: 'browser',
    format: 'esm' // Service workers typically use ES modules
  });

  // 3. Prepare css
  console.log('Minifying CSS...');
  const cssInputFile = 'css/hst.css';
  const cssOutputFile = path.join(WORK_DIR, 'hst-min.css');
  await minifyCss(cssInputFile, cssOutputFile);

  // 4. Packaging
  const WEB3_PACKAGE = 'web3.tar';

  // 4.1 Prepare web2 files
  const WEB2_DIR = path.join(WORK_DIR, 'web2');
  fs.mkdirSync(path.join(WEB2_DIR, 'static', 'js'), { recursive: true });
  fs.mkdirSync(path.join(WEB2_DIR, 'static', 'css'), { recursive: true });
  fs.copyFileSync(BUNDLE_JS_PATH, path.join(WEB2_DIR, 'static', 'js', 'hst-min.js'));
  fs.copyFileSync(BUNDLE_SW_PATH, path.join(WEB2_DIR, 'static', 'js', 'sw-min.js'));
  fs.copyFileSync(cssOutputFile, path.join(WEB2_DIR, 'static', 'css', 'hst-min.css'));

  // 4.2 Prepare web3 files
  const WEB3_DIR = path.join(WORK_DIR, 'web3');
  fs.mkdirSync(path.join(WEB3_DIR, 'user'), { recursive: true });
  fs.mkdirSync(path.join(WEB3_DIR, 'static'), { recursive: true });
  fs.copyFileSync('html/web3.html', path.join(WEB3_DIR, 'index.html'));
  fs.copyFileSync(cssOutputFile, path.join(WEB3_DIR, 'static', 'hst-min.css'));
  fs.copyFileSync(BUNDLE_JS_PATH, path.join(WEB3_DIR, 'static', 'hst-min.js'));
  fs.copyFileSync('configs/web3_config.js', path.join(WEB3_DIR, 'user', 'config.js'));
  fs.copyFileSync('configs/web3_config_example.js', path.join(WEB3_DIR, 'user', 'config.js.bak'));
  fs.copyFileSync('ext/cardano.min.js', path.join(WEB3_DIR, 'static', 'cardano-min.js'));

  // 4.3 Create tarball
  console.log('Creating tarball...');
  const workDirPath = path.resolve(WORK_DIR);
  const tarPath = path.join(workDirPath, WEB3_PACKAGE);
  execSync(`tar -cf ${tarPath} web3`, { cwd: workDirPath });
  execSync(`gzip -f ${tarPath}`, { cwd: workDirPath });

  console.log('[SUCCESS] Build completed successfully!');
  console.log(`Output directory: ${WORK_DIR}`);
  console.log(`Web3 package: ${path.join(WORK_DIR, WEB3_PACKAGE + '.gz')}`);
}

// Run build
build().catch(error => {
  console.error('[ERROR] Build failed:', error);
  process.exit(1);
});
