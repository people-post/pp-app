import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync, rmSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import type { Plugin } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to copy files after build and fix HTML paths for web2
function copyStaticFiles(outDir: string) {
  return {
    name: 'copy-static-files',
    closeBundle() {
      // For web2, move HTML file from html/web2.html to index.html and fix paths
      const htmlSource = resolve(outDir, 'html/web2.html');
      const htmlTarget = resolve(outDir, 'index.html');
      if (existsSync(htmlSource)) {
        let htmlContent = readFileSync(htmlSource, 'utf-8');
        // Fix paths: replace ../static with static
        htmlContent = htmlContent.replace(/\.\.\/static\//g, 'static/');
        writeFileSync(htmlTarget, htmlContent);
        // Remove the html directory
        rmSync(resolve(outDir, 'html'), { recursive: true, force: true });
      }
    }
  };
}

// Plugin to inject Vite client into HTML and serve static files from dist/web2
function devWwwHtmlPlugin(): Plugin {
  return {
    name: 'dev-www-html',
    configureServer(server) {
      const distStaticDir = resolve(__dirname, 'dist/web2/static');
      
      // Serve static files from dist/web2/static
      server.middlewares.use((req, res, next) => {
        // Handle root and index.html requests
        if (req.url === '/' || req.url === '/index.html') {
          // Read the local html/web2.html file
          try {
            const htmlPath = resolve(__dirname, 'html/web2.html');
            if (existsSync(htmlPath)) {
              let html = readFileSync(htmlPath, 'utf-8');
              // Inject Vite client script if not present
              if (!html.includes('@vite/client')) {
                html = html.replace(
                  '</head>',
                  '<script type="module" src="/@vite/client"></script></head>'
                );
              }
              res.setHeader('Content-Type', 'text/html');
              res.end(html);
              return;
            }
          } catch (error) {
            console.error('Failed to read html/web2.html:', error);
          }
        }
        
        // Serve static files from dist/web2/static (local only, no fallback)
        if (req.url?.startsWith('/static/')) {
          try {
            // Ignore query parameters completely - just get the path
            const urlPath = req.url.split('?')[0].split('#')[0];
            // Remove leading /static/ and handle ./ in path
            // Handle both /static/./path and /static/path patterns
            let relativePath = urlPath.replace(/^\/static\//, '').replace(/^\.\//, '').replace(/^\.\//, '');
            
            // Security check: ensure relative path doesn't contain ../
            if (relativePath.includes('..')) {
              console.warn(`[SECURITY] Blocked path with .. : ${req.url} -> ${relativePath}`);
              res.writeHead(403);
              res.end('Forbidden');
              return;
            }
            
            if (relativePath.startsWith('/')) {
              console.warn(`[SECURITY] Blocked absolute path: ${req.url} -> ${relativePath}`);
              res.writeHead(403);
              res.end('Forbidden');
              return;
            }
            
            // Resolve to absolute path
            let filePath = resolve(distStaticDir, relativePath);
            
            // Security check: ensure resolved file is within distStaticDir
            // Get absolute paths for both
            const absDistPath = resolve(distStaticDir);
            const absFilePath = resolve(filePath);
            
            // Normalize for comparison (handle Windows/Unix paths)
            const normalizedDistPath = absDistPath.replace(/\\/g, '/');
            const normalizedFilePath = absFilePath.replace(/\\/g, '/');
            
            // Check if file path is within the dist directory
            const isWithinDist = normalizedFilePath.startsWith(normalizedDistPath + '/') || 
                                 normalizedFilePath === normalizedDistPath;
            
            if (!isWithinDist) {
              console.error(`[SECURITY] Path check failed for: ${req.url}`);
              console.error(`  URL: ${req.url}`);
              console.error(`  URL Path: ${urlPath}`);
              console.error(`  Relative path: ${relativePath}`);
              console.error(`  Dist static dir: ${distStaticDir}`);
              console.error(`  Dist path (abs): ${absDistPath}`);
              console.error(`  Dist path (normalized): ${normalizedDistPath}`);
              console.error(`  File path (abs): ${absFilePath}`);
              console.error(`  File path (normalized): ${normalizedFilePath}`);
              console.error(`  Starts with check: ${normalizedFilePath.startsWith(normalizedDistPath + '/')}`);
              console.error(`  Equals check: ${normalizedFilePath === normalizedDistPath}`);
              res.writeHead(403);
              res.end('Forbidden');
              return;
            }
            
            // If CSS file doesn't exist in dist, try to serve from source
            if (!existsSync(filePath) && relativePath === 'css/hst-min.css') {
              const sourceCssPath = resolve(__dirname, 'css/hst.css');
              if (existsSync(sourceCssPath)) {
                filePath = sourceCssPath;
              }
            }
            
            // If JS file doesn't exist in dist, return 404
            if (!existsSync(filePath) && relativePath === 'js/hst-min.js') {
              res.writeHead(404);
              res.end('File not found. Please build the project first.');
              return;
            }
            
            if (existsSync(filePath)) {
              const fileContent = readFileSync(filePath);
              // Set appropriate content type
              const ext = filePath.split('.').pop()?.toLowerCase();
              const contentType = 
                ext === 'css' ? 'text/css' :
                ext === 'js' ? 'application/javascript' :
                ext === 'svg' ? 'image/svg+xml' :
                ext === 'png' ? 'image/png' :
                ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' :
                'application/octet-stream';
              
              res.setHeader('Content-Type', contentType);
              res.end(fileContent);
              return;
            } else {
              res.writeHead(404);
              res.end('File not found');
              return;
            }
          } catch (error) {
            console.error('Failed to serve static file:', error);
            res.writeHead(500);
            res.end('Internal server error');
            return;
          }
        }
        
        next();
      });
    }
  };
}

// Web2 configuration (Vite only for web2)
export const web2Config = defineConfig({
  root: resolve(__dirname),
  base: './',
  publicDir: false,
  build: {
    outDir: 'dist/web2',
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(__dirname, 'src/app.ts'),
      output: {
        entryFileNames: 'static/js/hst-min.js',
        chunkFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'static/css/hst-min.css';
          }
          return 'static/[name][extname]';
        },
        format: 'iife',
        name: 'App'
      }
    },
    sourcemap: true,
    minify: 'esbuild',
    cssCodeSplit: false,
    target: 'es2022'
  },
  css: {
    preprocessorOptions: {
      // Process CSS from css/hst.css
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  plugins: [
    copyStaticFiles('dist/web2'),
    devWwwHtmlPlugin()
  ],
  server: {
    host: 'localhost',
    port: 3000,
    open: false,
    cors: true,
    proxy: {
      // Proxy API requests to dev-www
      '/api': {
        target: 'http://dev-www',
        changeOrigin: true,
        secure: false
      },
      // Proxy other file requests (favicons, etc.) to dev-www
      '/file': {
        target: 'http://dev-www',
        changeOrigin: true,
        secure: false
      },
      // Proxy manifest.json to dev-www
      '/manifest.json': {
        target: 'http://dev-www',
        changeOrigin: true,
        secure: false
      }
    }
  }
});

// Default export for web2 (with dev server support)
export default web2Config;
