const path = require('path');
const appRoot = path.join(__dirname, '..');

require('electron-compile').init(appRoot, require.resolve('./main'));
