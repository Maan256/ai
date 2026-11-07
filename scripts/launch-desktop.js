const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const electronDir = path.join(projectRoot, 'node_modules', 'electron');
const distDir = path.join(electronDir, 'dist');
const pathFile = path.join(electronDir, 'path.txt');
const versionFile = path.join(distDir, 'version');
const executableName = process.platform === 'win32' ? 'electron.exe' : 'electron';
const electronBinary = path.join(distDir, executableName);

function hasValidBinary() {
  return fs.existsSync(pathFile) && fs.existsSync(versionFile) && fs.existsSync(electronBinary);
}

if (!hasValidBinary()) {
  console.error('Electron is not installed correctly.');
  console.error('The Electron binary was not downloaded, so the desktop launcher cannot start.');
  console.error('');
  console.error('Fix from the project root with:');
  console.error('  $env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"');
  console.error('  npm install --save-dev electron@32.2.1 --foreground-scripts');
  process.exit(1);
}

const electronApp = require('electron');
const electronProcess = spawn(electronApp, [path.join(projectRoot, 'electron', 'main.js')], {
  cwd: projectRoot,
  stdio: 'inherit',
  env: {
    ...process.env,
    ELECTRON_ENABLE_LOGGING: process.env.ELECTRON_ENABLE_LOGGING || '0',
  },
});

electronProcess.on('exit', (code, signal) => {
  if (signal) {
    process.exit(1);
  }
  process.exit(code ?? 0);
});

electronProcess.on('error', (error) => {
  console.error('Unable to launch Electron desktop app:', error.message);
  process.exit(1);
});
