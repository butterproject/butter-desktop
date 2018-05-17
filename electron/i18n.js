var i18n = require('i18next');
const Backend = require('i18next-node-fs-backend');

i18n
    .use(Backend)
    .init({
        backend: {
            // path where resources get loaded from
            loadPath: `./locales/{{lng}}/{{ns}}.json`,

            // path to post missing resources
            addPath: `./locales/{{lng}}/{{ns}}.missing.json`,

            // jsonIndent to use when storing json files
            jsonIndent: 2
        },
        fallbackLng: 'en',

        // have a common namespace used around the full app
        ns: ['common'],
        defaultNS: 'common',

        debug: true,

        interpolation: {
        escapeValue: false // not needed for react!!
    }
});

module.exports = i18n;
