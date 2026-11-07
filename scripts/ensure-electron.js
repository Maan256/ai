const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const electronDir = path.join(projectRoot, 'node_modules', 'electron');
const distDir = path.join(electronDir, 'dist');
const pathFile = path.join(electronDir, 'path.txt');
const versionFile = path.join(distDir, 'version');
const executableName = process.platform === 'win32' ? 'electron.exe' : 'electron';
const executablePath = path.join(distDir, executableName);

function hasValidBinary() {
  if (!fs.existsSync(electronDir)) {
    return false;
  }

  if (!fs.existsSync(pathFile) || !fs.existsSync(versionFile)) {
    return false;
  }

  if (!fs.existsSync(executablePath)) {
    return false;
  }

  return true;
}

if (hasValidBinary()) {
  process.exit(0);
}

console.error('');
console.error('Electron binary is missing or incomplete.');
console.error('This usually means the release ZIP did not finish downloading or a network policy blocked the download.');
console.error('');
console.error('Try one of these fixes from the project root:');
console.error('  1) Remove the broken install:');
console.error('     rmdir /s /q node_modules\electron');
console.error('  2) Reinstall with the mirror override:');
console.error('     $env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"');
console.error('     npm install --save-dev electron@32.2.1 --foreground-scripts');
console.error('  3) If the network is still blocked, use a machine with direct access to the Electron release hosts.');
console.error('');
process.exit(1);
