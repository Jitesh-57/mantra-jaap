// Copies the web app into www/, which Capacitor bundles into the Android app.
import { cpSync, rmSync, mkdirSync } from 'node:fs';

rmSync('www', { recursive: true, force: true });
mkdirSync('www');
for (const path of ['index.html', 'css', 'js']) cpSync(path, `www/${path}`, { recursive: true });
console.log('Web app copied to www/');
