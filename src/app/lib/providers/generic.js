(function (App) {
    'use strict';
    var fs = require('fs');
    var cache = App.Providers._cache = {};
    var registry = App.Providers._registry = {};

    App.Providers.Generic = require('butter-provider');

    function delProvider(name) {
        if (cache[name]) {
            console.log('Delete provider cache', name);
            return delete cache[name];
        }
    }

    function installProvider(PO) {
        var PI = new PO ();
        var name = PI.config ? PI.config.name : null;

        if (!name) {
            return console.error(PO, PI.config, 'doesnt have a name');
        }

        if (registry[name]) {
            return console.error('double definition of', name, PO, PI.config, 'is the same as', registry[name]);
        }

        console.log('Added %s to provider registry', name);
        registry[name] = PO;

        return name;
    }

    function getProviderFromRegistry(name) {
        return registry[name];
    }

    function getProviderFromCacheByType(type) {
        return _.filter(cache, function (p) {
            return p.config.type === type;
        });
    }

    function getProvider(uri) {
        if (!uri) {
            /* XXX(xaiki): this is for debug purposes, will it bite us later ? */
            /* XXX(vankasteelj): it did. */
            console.error('Asked for an empty provider, this should never happen, dumping provider cache and registry', cache, registry);
            return cache;
        }

        var providerName = uri.split('?')[0];

        if (cache[uri]) {
            return cache[uri];
        }

        var provider = getProviderFromRegistry(providerName);
        if (!provider) {
            if (installProvider(require('butter-provider-' + providerName))) {
                console.warn('I loaded', providerName, 'from npm but you didn\'t add it to your package.json');
                provider = getProviderFromRegistry(providerName);
            } else {
                console.error('Couldn\'t find provider', providerName);
                return null;
            }
        }

        console.log('Spawning new provider', uri);
        var p = cache[uri] = new provider(uri);

        //HACK(xaiki): set the provider name in the returned object.
        p.uri = uri;
        return p;
    }

    App.Providers.get = getProvider;
    App.Providers.delete = delProvider;
    App.Providers.install = installProvider;

    App.Providers.getFromRegistry = getProviderFromRegistry;
    App.Providers.getByType = getProviderFromCacheByType;
})(window.App);
