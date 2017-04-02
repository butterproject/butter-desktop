var i18n = require('i18next');
var Backend = require('i18next-node-fs-backend');

module.exports = i18n
    .use(Backend)
    .init({
        backend: {
            loadPath: '/src/app/languages/{{ns}}.json',
            addPath: '/src/app/languages/{{ns}}.missing.json',
        },

        fallbackLng: 'en',

        // have a common namespace used around the full app
        ns: ['Butter Desktop'],
        defaultNS: 'Butter Desktop',

    });
