// Copies the web app into www/, which Capacitor bundles into the Android app.
import { cpSync, rmSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

rmSync('www', { recursive: true, force: true });
mkdirSync('www/js/vendor', { recursive: true });
for (const path of ['index.html', 'privacy.html', 'css', 'js', 'img']) cpSync(path, `www/${path}`, { recursive: true });

// The Android bridge has no registerPlugin(); Capacitor's core script adds it.
// It must load before the app's module, and only inside the app (not on the website).
cpSync('node_modules/@capacitor/core/dist/capacitor.js', 'www/js/vendor/capacitor.js');
const html = readFileSync('www/index.html', 'utf8');
const tag = '<script type="module" src="js/app.js"></script>';
if (!html.includes(tag)) throw new Error('index.html: app script tag not found');
writeFileSync('www/index.html', html.replace(tag, '<script src="js/vendor/capacitor.js"></script>\n' + tag));
console.log('Web app copied to www/ (with Capacitor core)');
