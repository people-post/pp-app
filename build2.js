#!/usr/bin/env node

/**
 * Build script for web2 target
 */

import fs from 'fs';
import path from 'path';
import {fileURLToPath} from 'url';
import {dirname} from 'path';
import * as esbuild from 'esbuild';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORK_DIR = 'obj';
const ENTRY_APP_JS = 'src/app.ts';
const ENTRY_SW_JS = 'src/sw.ts';

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
 * Process Tailwind CSS using PostCSS
 * @param {string} inputFile - Input CSS file (e.g., 'src/css/tailwind.css')
 * @param {string} outputFile - Output processed CSS file
 */
async function processTailwindCss(inputFile, outputFile) {
  console.log(`Processing Tailwind CSS: ${inputFile}...`);
  
  try {
    const css = fs.readFileSync(inputFile, 'utf8');
    
    const result = await postcss([tailwindcss()]).process(css, {
      from: inputFile,
      to: outputFile
    });
    
    // Write the processed CSS
    fs.writeFileSync(outputFile, result.css);
    
    // Write source map if available
    if (result.map) {
      fs.writeFileSync(outputFile + '.map', result.map.toString());
    }
    
    console.log(`[SUCCESS] Processed Tailwind CSS: ${inputFile} -> ${outputFile}`);
  } catch (error) {
    console.error(`Error processing Tailwind CSS: ${error.message}`);
    throw error;
  }
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
 * Build web2 target
 */
async function buildWeb2() {
  console.log('Starting web2 build...');

  // Create web2 work directory
  const WEB2_WORK_DIR = path.join(WORK_DIR, 'web2-temp');
  if (fs.existsSync(WEB2_WORK_DIR)) {
    fs.rmSync(WEB2_WORK_DIR, {recursive : true, force : true});
  }
  fs.mkdirSync(WEB2_WORK_DIR, {recursive : true});

  // Bundle JavaScript for web2
  const WEB2_BUNDLE_JS_PATH = path.join(WEB2_WORK_DIR, 'hst-min.js');
  await bundleJs(ENTRY_APP_JS, WEB2_BUNDLE_JS_PATH);

  // Bundle service worker for web2
  const WEB2_BUNDLE_SW_PATH = path.join(WEB2_WORK_DIR, 'sw-min.js');
  await bundleJs(ENTRY_SW_JS, WEB2_BUNDLE_SW_PATH, {
    platform : 'browser',
    format : 'esm'
  });

  // Process Tailwind CSS for web2
  console.log('Processing CSS for web2...');
  const cssInputFile = 'src/css/tailwind.css';
  const cssProcessedFile = path.join(WEB2_WORK_DIR, 'hst-processed.css');
  await processTailwindCss(cssInputFile, cssProcessedFile);
  
  // Minify the processed CSS
  const cssOutputFile = path.join(WEB2_WORK_DIR, 'hst-min.css');
  await minifyCss(cssProcessedFile, cssOutputFile);

  // Prepare web2 output directory
  const WEB2_DIR = path.join('dist', 'web2');
  if (fs.existsSync(WEB2_DIR)) {
    fs.rmSync(WEB2_DIR, {recursive : true, force : true});
  }
  fs.mkdirSync(path.join(WEB2_DIR, 'static', 'js'), {recursive : true});
  fs.mkdirSync(path.join(WEB2_DIR, 'static', 'css'), {recursive : true});
  
  // Copy JS files and their map files
  fs.copyFileSync(WEB2_BUNDLE_JS_PATH,
                  path.join(WEB2_DIR, 'static', 'js', 'hst-min.js'));
  fs.copyFileSync(WEB2_BUNDLE_JS_PATH + '.map',
                  path.join(WEB2_DIR, 'static', 'js', 'hst-min.js.map'));
  
  fs.copyFileSync(WEB2_BUNDLE_SW_PATH,
                  path.join(WEB2_DIR, 'static', 'js', 'sw-min.js'));
  fs.copyFileSync(WEB2_BUNDLE_SW_PATH + '.map',
                  path.join(WEB2_DIR, 'static', 'js', 'sw-min.js.map'));
  
  // Copy CSS
  fs.copyFileSync(cssOutputFile,
                  path.join(WEB2_DIR, 'static', 'css', 'hst-min.css'));

  // Cleanup temp directory
  fs.rmSync(WEB2_WORK_DIR, {recursive : true, force : true});

  console.log('[SUCCESS] Web2 build completed!');
  console.log(`Output directory: ${WEB2_DIR}`);
}

// Run build
buildWeb2().catch(error => {
  console.error('[ERROR] Web2 build failed:', error);
  process.exit(1);
});
