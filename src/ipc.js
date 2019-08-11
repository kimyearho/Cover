const { ipcMain } = require("electron");

module.exports = (win, player) => {
  ipcMain.on("event:route", (event, arg) => {
    console.log(arg);
    event.reply("event:reply", "pong");
  });

};
