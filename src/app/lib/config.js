(function (App) {
    'use strict';

    var Config = {
        title: Settings.projectName,
        platform: process.platform,
        sorters_fav: [
            'watched items',
            'year',
            'title',
            'rating'
        ],

        types_fav: [
            'All',
            'Movies',
            'TV',
            'Anime'
        ],
        cache: {
            name: 'cachedb',
            version: '1.7',
            tables: ['subtitle'],
            desc: 'Cache database',
            size: 10 * 1024 * 1024
        },

        cachev2: {
            name: 'cache',
            version: 5,
            tables: ['metadata']
        },

        getTabs: function () {
            var tabs = Settings.tabs;
            return Object.keys(tabs)
                .sort((a, b) => (tabs[a].order > tabs[b].order))
                .map(t => (Object.assign({type: t}, tabs[t])));
        },

        getTabTypes: function () {
            return Object.values(this.getTabs()).map(t => (t.type));
        },

        getProviderForType: function (type) {
            var provider = Settings.providers[type];

            if (!provider) {
                console.error('Provider type: \'%s\' isn\'t defined in App.Settings.providers', type);
                return null;
            }

            return App.Providers.get(provider);
        },

        getProvidersForTabType: function (tabType) {
            var tab = Settings.tabs[tabType];
            var providers = tab.providers;

            if (providers instanceof Array) {
                return providers
                    .map(t => (App.Providers.get(t)));
            } else if (typeof providers === 'object') {
                return Object.values(providers)
                    .map(t => (App.Providers.get(t)));
            }

            console.error ('Couldn\'t find providers list in tab', tab);
            return null;
        },

        getProviderNameForTabType: function (tabType) {
            return this.getProvidersForTabType(tabType)
                .map(p => (p.config.tabName));
        },

        getFiltredProviderNames: function (providers) {
            var ret = providers
                .map(c => (c.split('?')[0]))
                .reduce((a, c) => {
                    a[c] = ~~(a[c]) + 1;
                    return a;
                }, {});

            return _.map(ret, function (v, k) {
                return k.concat((v > 1) ? ':' + v : '');
            });
        }

    };

    App.Config = Config;
})(window.App);
