(function (App) {
    'use strict';

    var fs = require('fs');

    function get_themes() {
        var theme_files = fs.readdirSync('./themes/');
        var themes = theme_files.reduce((a, file) => {
            var r = {};
            r[file] = file.slice(0, -10).split('_').join(' ');
            return Object.assign({}, a, r);
        });

        var tp_theme_files = fs.readdirSync('./themes/third_party');
        var tp_themes = tp_theme_files.reduce((a, file) => {
            var r = {};
            r[file] = file.slice(0, -10).split('_').join(' ') + i18n.__('(Third Party)');
            return Object.assign({}, a, r);
        });

        return Object.assign({}, themes, tp_themes);
    }

    App.Themes = get_themes();
})(window.App);
