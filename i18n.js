var i18n = require('i18next');

i18n.init({
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
