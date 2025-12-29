#!/usr/bin/env node

/**
 * Build script for pp-app
 * Replaces package.sh functionality with Node.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { minify } from 'terser';
import { execSync } from 'child_process';
import uglifycss from 'uglifycss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const WORK_DIR = 'obj';
const ENTRY_JS_PATH = 'src/index.js';
const BUNDLE_JS_PATH = path.join(WORK_DIR, 'app-min.js');

/**
 * Merge JavaScript files listed in a file list
 * @param {string} listFile - Path to file containing list of JS files
 * @param {string} outputFile - Path to output merged file
 */
function mergeFiles(listFile, outputFile) {
  const relDir = path.dirname(listFile);
  const fileList = fs.readFileSync(listFile, 'utf-8')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));

  // Ensure output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Remove existing output file
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }

  console.log(`Merging js from ${listFile} begins`);
  const header = `/* Last merge : ${new Date().toISOString()} */\n\n`;
  fs.writeFileSync(outputFile, header);

  for (const file of fileList) {
    const filePath = path.join(relDir, file);
    if (fs.existsSync(filePath) && filePath !== outputFile) {
      const content = fs.readFileSync(filePath, 'utf-8');
      fs.appendFileSync(outputFile, content + '\n');
    } else if (!fs.existsSync(filePath)) {
      console.error(`File missing: ${filePath}`);
    }
  }

  console.log(`[SUCCESS] Files listed in ${listFile} have been successfully merged into ${outputFile}`);
}

/**
 * Compile and minify JavaScript
 * @param {string} listFile - Path to file list
 * @param {string} tempFile - Temporary merged file path
 * @param {string} targetFile - Final minified output file
 */
async function compileJs(listFile, tempFile, targetFile) {
  // Merge files
  mergeFiles(listFile, tempFile);

  // Read merged file
  const code = fs.readFileSync(tempFile, 'utf-8');

  // Minify with terser
  const result = await minify(code, {
    compress: {
      defaults: true
    },
    sourceMap: {
      filename: path.basename(tempFile),
      url: path.basename(targetFile) + '.map'
    }
  });

  if (result.error) {
    throw new Error(`Terser error: ${result.error}`);
  }

  // Write minified code
  fs.writeFileSync(targetFile, result.code);
  if (result.map) {
    fs.writeFileSync(targetFile + '.map', result.map);
  }
}

/**
 * Minify CSS file
 * @param {string} inputFile - Input CSS file
 * @param {string} outputFile - Output minified CSS file
 */
function minifyCss(inputFile, outputFile) {
  try {
    const cssContent = fs.readFileSync(inputFile, 'utf-8');
    const minified = uglifycss.processString(cssContent);
    fs.writeFileSync(outputFile, minified);
  } catch (error) {
    console.error(`Error minifying CSS: ${error.message}`);
    throw error;
  }
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

  // 2. Prepare js
  const appListFile = 'app/file_list.txt';
  const swListFile = 'sw/file_list.txt';
  const appTempFile = path.join(WORK_DIR, 'app.js');
  const swTempFile = path.join(WORK_DIR, 'sw.js');
  const swMinFile = path.join(WORK_DIR, 'sw-min.js');

  // Compile app js
  console.log('Compiling app JavaScript...');
  await compileJs(appListFile, appTempFile, BUNDLE_JS_PATH);

  // Compile service worker js
  console.log('Compiling service worker JavaScript...');
  await compileJs(swListFile, swTempFile, swMinFile);

  // 3. Prepare css
  console.log('Minifying CSS...');
  const cssInputFile = 'css/hst.css';
  const cssOutputFile = path.join(WORK_DIR, 'hst-min.css');
  minifyCss(cssInputFile, cssOutputFile);

  // 4. Packaging
  const WEB3_PACKAGE = 'web3.tar';

  // 4.1 Prepare web2 files
  const WEB2_DIR = path.join(WORK_DIR, 'web2');
  fs.mkdirSync(path.join(WEB2_DIR, 'static', 'js'), { recursive: true });
  fs.mkdirSync(path.join(WEB2_DIR, 'static', 'css'), { recursive: true });
  fs.copyFileSync(BUNDLE_JS_PATH, path.join(WEB2_DIR, 'static', 'js', 'hst-min.js'));
  fs.copyFileSync(swMinFile, path.join(WEB2_DIR, 'static', 'js', 'sw-min.js'));
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
