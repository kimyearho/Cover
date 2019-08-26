"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import {
  createProtocol,
  installVueDevtools
} from "vue-cli-plugin-electron-builder/lib";
const isDevelopment = process.env.NODE_ENV !== "production";


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;
let player;

require('./ipc')(win, player)

app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } }
]);

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 400,
    height: 705,
    resizable: false,
    maximizable: false,
    transparent: true,
    webPreferences: {
      nodeIntegration: true,
      backgroundThrottling: false
    }
  });

  win.setMenu(null);
  // win.webContents.openDevTools();
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    // win.loadURL("app://./index.html");
    win.loadURL("http://localhost:8080");
  }

  win.webContents.on("did-finish-load", () => {
    if (player) return;

    const playerPath = "http://kstory8715.kr";
    player = new BrowserWindow({
      width: 420,
      height: 280,
      title: "Metube Video Player",
      webPreferences: {
        nodeIntegration: true,
        backgroundThrottling: false
      }
    });
    player.setMenu(null);
    // player.webContents.openDevTools();
    player.loadURL(playerPath);
    player.on("close", e => {
      if (!willQuitApp) {
        dialog.showErrorBox(
          "Oops! 🤕",
          "Sorry, player window cannot be closed. You can only minimize it or Setting in hide option"
        );
        e.preventDefault();
      }
    });
  });

  win.on("closed", () => {
    win = null;
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installVueDevtools();
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Window to Player Events
ipcMain.on("win2Player", (e, args) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("main -> " + args);
    }
    player.webContents.send("win2Player", args);
  } catch (err) {
    /* window already closed */
  }
});

// Player to Window Events
ipcMain.on("player2Win", (e, args) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("sub -> " + args);
    }
    win.webContents.send("player2Win", args);
  } catch (err) {
    /* window already closed */
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", data => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}
