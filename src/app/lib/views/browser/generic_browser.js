(function (App) {
    'use strict';

    var _cache = {};

    /**
     * Manage browsing:
     *  * Create filter views
     *  * Create movie list
     *  * Fetch new movie collection and pass them to the movie list view
     *  * Show movie detail
     *  * Start playing a movie
     */
    var ButterBrowser = Backbone.Marionette.LayoutView.extend({
        template: '#browser-tpl',
        className: 'main-browser',
        regions: {
            FilterBar: '.filter-bar-region',
            ItemList: '.list-region'
        },
        events: {
            'click .retry-button': 'onFilterChange',
            'click .online-search': 'onlineSearch'
        },

        initialize: function (attrs) {
            this.filter = new App.Model.Filter(this.filters);

            this.collectionModel = attrs.collectionModel || this.collectionModel;
            this.collection = new this.collectionModel([], {
                filter: this.filter
            });

            this.collection.fetch();

            this.listenTo(this.filter, 'change', this.onFilterChange);

        },

        onShow: function () {
            if (Settings.rememberFilters) {
                this.filter.set(this.getSavedFilter());
            }

            this.bar = new App.View.FilterBar({
                model: this.filter
            });

            this.FilterBar.show(this.bar);

            this.ItemList.show(new App.View.List({
                collection: this.collection
            }));

            if (!isNaN(startupTime)) {
                console.info('%s %s startup time: %sms', Settings.projectName, Settings.version, (window.performance.now() - startupTime).toFixed()); // started in database.js;
                startupTime = 'none';
                if (Settings.bigPicture) {
                    var zoom = ScreenResolution.HD ? 2 : 3;
                    win.zoomLevel = zoom;
                }
                App.vent.trigger('app:started');
            }
        },
        onFilterChange: function () {
            this.saveFilter();

            this.collection = new this.collectionModel([], {
                filter: this.filter
            });
            App.vent.trigger('tvshow:closeDetail');
            this.collection.fetch();

            this.ItemList.show(new App.View.List({
                collection: this.collection
            }));
        },
        onlineSearch: function () {
            switch (App.currentview) { //FIXME #576
            case 'movies':
                Settings.OnlineSearchCategory = 'Movies';
                break;
            case 'shows':
                Settings.OnlineSearchCategory = 'TV Series';
                break;
            case 'anime':
                Settings.OnlineSearchCategory = 'Anime';
                break;
            default:
            }

            if (!Settings.activateTorrentCollection) {
                AdvSettings.set('activateTorrentCollection', true);
                $('#torrent_col').css('display', 'block');
            }

            $('#filterbar-torrent-collection').click();
        },

        focusSearch: function (e) {
            this.bar.focusSearch();
        },

        currentView: function () {
            if (App.currentview) {
                return App.currentview;
            }

            var activetab;
            var tabs = App.Config.getTabTypes();

            if (AdvSettings.get('startScreen') === 'Last Open') {
                activetab = AdvSettings.get('lastTab');
            } else {
                activetab = AdvSettings.get('startScreen');
            }

            if (activetab in tabs) {
                return activetab;
            }

            return tabs[0];
        },

        saveFilter: function () {
            var filters = AdvSettings.get('filters') || {};
            filters[this.currentView()] = this.filter.pick('sorter', 'genre', 'type', 'order');
            AdvSettings.set('filters', filters);
        },

        getSavedFilter: function () {
            var filters = AdvSettings.get('filters') || {};
            return filters[this.currentView()] || this.filter.pick('sorter', 'genre', 'type', 'order');
        }
    });

    App.View.getViewForTab = function (tab) {
        if (_cache[tab]) {
            return _cache[tab];
        }

        var filters = App.Config.getProvidersForTabType(tab)
            .map(p => p.filters)
            .reduce((a, c) => ({
                genres:  Object.assign({}, a.genres,  c.genres),
                sorters: Object.assign({}, a.sorters, c.sorters),
                types:   Object.assign({}, a.types,   c.types)
            }), {});

        if (! Object.keys(filters.types).length) {
            delete filters.types;
        }

        _cache[tab] = App.View.ButterBrowser.extend({
            filters: filters
        });

        return _cache[tab];
    };

    App.View.ButterBrowser = ButterBrowser;
})(window.App);
