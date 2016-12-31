(function (App) {
    'use strict';

    var WatchlistCollection = App.Model.Collection.extend({
        model: App.Model.Movie,
        initialize: function () {
            this.hasMore = false;
            this.providers = {
                torrents: [App.Providers.get('Watchlist')]
            };
        },
        fetch: function () {
            return App.Providers.get('Watchlist').fetch().then((items) => {
                for (var i in items.results) { //hack FIXME - #557
                    items.results[i].providers = {
                        torrents: [],
                        metadata: []
                    };
                }
                this.add(items.results);
                this.state = 'loaded';
                this.trigger('loaded', this, this.state);
            }).catch((error) => {
                this.state = 'error';
                this.trigger('loaded', this, this.state);
                console.error('WatchlistCollection.fetch()', error);
            });
        },
        fetchMore: function () {
            return;
        }

    });

    App.Model.WatchlistCollection = WatchlistCollection;
})(window.App);
