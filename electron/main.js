const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const http = require("http");
const { spawn } = require("child_process");

let backendProcess;
let frontendProcess;
let splashWindow;
let mainWindow;

function isBackendRunning() {
  return new Promise((resolve) => {
    const request = http.get("http://localhost:5000/api/health", (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });

    request.on("error", () => resolve(false));
  });
}

async function startBackend() {
  if (await isBackendRunning()) {
    console.log("Backend already running; skipping child-process launch.");
    return;
  }

  const backendPath = path.join(__dirname, "..", "backend", "server.js");

  backendProcess = spawn(process.execPath, [backendPath], {
    cwd: path.join(__dirname, ".."),
    stdio: "inherit",
    env: {
      ...process.env,
      NODE_ENV: "production",
    },
  });

  backendProcess.on("error", (error) => {
    console.error("Backend failed to start:", error);
  });
}

function startFrontendDevServer() {
  if (frontendProcess) return;

  const frontendScript = process.platform === "win32" ? "npm.cmd" : "npm";
  const frontendDir = path.join(__dirname, "..", "frontend");

  frontendProcess = spawn(
    frontendScript,
    ["--prefix", frontendDir, "run", "dev", "--", "--host", "127.0.0.1"],
    {
      cwd: path.join(__dirname, ".."),
      stdio: "inherit",
      env: {
        ...process.env,
        BROWSER: "none",
      },
    },
  );

  frontendProcess.on("error", (error) => {
    console.error("Frontend dev server failed:", error);
  });
}

function getFrontendUrl() {
  const builtIndex = path.join(__dirname, "..", "frontend", "dist", "index.html");

  if (fs.existsSync(builtIndex)) {
    return null;
  }

  return "http://127.0.0.1:5173";
}

function createSplashWindow() {
  splashWindow = new BrowserWindow({
    width: 500,
    height: 320,
    frame: false,
    transparent: true,
    resizable: false,
    alwaysOnTop: true,
    show: false,
    backgroundColor: "#121826",
  });

  splashWindow.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(`
      <html>
        <body style="margin:0; font-family:Arial, sans-serif; background: radial-gradient(circle at top, #1f2d4d 0%, #121826 45%, #0b101a 100%); display:flex; align-items:center; justify-content:center; height:100vh; color:white;">
          <div style="text-align:center; width:100%;">
            <div style="font-size:42px; font-weight:800; letter-spacing:0.08em; margin-bottom:12px;">B</div>
            <div style="font-size:28px; font-weight:700; letter-spacing:0.15em;">BISTRO BYTE</div>
            <div style="margin-top:18px; font-size:13px; letter-spacing:0.22em; text-transform:uppercase; opacity:0.72;">Preparing your order desk</div>
          </div>
        </body>
      </html>
    `)}`,
  );

  splashWindow.once("ready-to-show", () => splashWindow.show());
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1100,
    minHeight: 700,
    backgroundColor: "#fffaf5",
    autoHideMenuBar: true,
    title: "Bistro Byte",
    frame: false,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  ipcMain.on("minimize-window", () => mainWindow.minimize());
  ipcMain.on("maximize-window", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });
  ipcMain.on("close-window", () => mainWindow.close());

  const localFile = path.join(
    __dirname,
    "..",
    "frontend",
    "dist",
    "index.html",
  );

  const appUrl = getFrontendUrl();

  if (app.isPackaged || fs.existsSync(localFile)) {
    mainWindow.loadFile(localFile);
  } else {
    startFrontendDevServer();
    setTimeout(() => mainWindow.loadURL(appUrl), 1500);
  }

  if (splashWindow) {
    setTimeout(() => {
      splashWindow.close();
      splashWindow = null;
      mainWindow.show();
    }, 1400);
  } else {
    mainWindow.show();
  }
}

app.whenReady().then(() => {
  startBackend();
  createSplashWindow();
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (backendProcess) {
    backendProcess.kill();
  }

  if (frontendProcess) {
    frontendProcess.kill();
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
