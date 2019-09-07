const customTitlebar = require('custom-electron-titlebar');

new customTitlebar.Titlebar({
    backgroundColor: customTitlebar.Color.fromHex('#2b2e3b'),
    icon: './favicon.ico',
    shadow: true
});