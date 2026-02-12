#!/usr/bin/env node

/**
 * Build script to create a single, self-contained HTML file
 * with no external dependencies.
 * 
 * Usage: node build-standalone.js
 * 
 * First run: curl -sL https://cdn.tailwindcss.com > tailwind.css
 */

import { build } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, 'dist');
const assetsDir = path.join(distDir, 'assets');
const docsDir = path.join(__dirname, 'docs');
const outputFile = path.join(docsDir, 'index.html');
const tailwindFile = path.join(__dirname, 'tailwind.css');

async function buildStandalone() {
  console.log('Building app with Vite...');
  
  // Clean dist directory first
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true });
  }
  
  // Create docs directory if it doesn't exist
  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }
  
  // Build the app
  await build({
    build: {
      outDir: 'dist',
      assetsInlineLimit: Infinity,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          inlineDynamicImports: true,
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash][extname]',
        },
      },
    },
  });

  console.log('Reading built files...');
  
  // Read the built HTML file
  const htmlPath = path.join(distDir, 'index.html');
  const html = fs.readFileSync(htmlPath, 'utf-8');
  
  // Find where the built JS and CSS files are referenced
  const jsMatch = html.match(/<script[^>]*src="([^"]*\.js)"[^>]*>/);
  const cssMatch = html.match(/<link[^>]*rel="stylesheet"[^>]*href="([^"]*\.css)"[^>]*>/);
  
  // Read the JS content
  let jsContent = '';
  if (jsMatch) {
    const jsPath = path.join(distDir, jsMatch[1].replace(/^\//, ''));
    if (fs.existsSync(jsPath)) {
      jsContent = fs.readFileSync(jsPath, 'utf-8');
    }
  }
  
  // Read the CSS content
  let cssContent = '';
  if (cssMatch) {
    const cssPath = path.join(distDir, cssMatch[1].replace(/^\//, ''));
    if (fs.existsSync(cssPath)) {
      cssContent = fs.readFileSync(cssPath, 'utf-8');
    }
  }
  
  // Read Tailwind CSS
  let tailwindContent = '';
  if (fs.existsSync(tailwindFile)) {
    console.log('Inlining Tailwind CSS...');
    tailwindContent = fs.readFileSync(tailwindFile, 'utf-8');
  } else {
    console.warn('⚠️  tailwind.css not found. Run: curl -sL https://cdn.tailwindcss.com > tailwind.css');
  }
  
  // Build the standalone HTML from scratch
  const standaloneHtml = `<!DOCTYPE html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vistral Temporal Bindings</title>
    <script>${tailwindContent}</script>
    <script>
      tailwind.config = {
        darkMode: 'class',
        theme: {
          extend: {
            colors: {
              background: 'var(--bg-main)',
              surface: 'var(--bg-surface)',
              border: 'var(--border-color)',
              primary: '#10b981',
              secondary: '#a1a1aa',
            },
            fontFamily: {
              mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
            },
            animation: {
              'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              'fade-in': 'fadeIn 0.5s ease-out',
            },
            keyframes: {
              fadeIn: {
                '0%': { opacity: '0', transform: 'translateY(5px)' },
                '100%': { opacity: '1', transform: 'translateY(0)' },
              }
            }
          },
        },
      };
    </script>
    <style>
      :root {
        --bg-main: #ffffff;
        --bg-surface: #f4f4f5;
        --border-color: #e4e4e7;
      }
      .dark {
        --bg-main: #09090b;
        --bg-surface: #18181b;
        --border-color: #27272a;
      }
      body {
        background-color: var(--bg-main);
        color: inherit;
        transition: background-color 0.3s ease, color 0.3s ease;
      }
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: var(--bg-surface);
      }
      ::-webkit-scrollbar-thumb {
        background: #a1a1aa;
        border-radius: 2px;
      }
      .dark ::-webkit-scrollbar-thumb {
        background: #3f3f46;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #71717a;
      }
      .dark ::-webkit-scrollbar-thumb:hover {
        background: #52525b;
      }
    </style>
    ${cssContent ? `<style>${cssContent}</style>` : ''}
  </head>
  <body>
    <div id="root"></div>
    <script type="module">${jsContent}</script>
  </body>
</html>`;
  
  // Write the standalone HTML file
  fs.writeFileSync(outputFile, standaloneHtml);
  
  // Get file size
  const stats = fs.statSync(outputFile);
  const sizeKB = (stats.size / 1024).toFixed(2);
  
  console.log(`✅ Standalone HTML created: ${outputFile}`);
  console.log(`📦 File size: ${sizeKB} KB`);
  console.log('🚀 Open docs/index.html in your browser - no server needed!');
}

buildStandalone().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
