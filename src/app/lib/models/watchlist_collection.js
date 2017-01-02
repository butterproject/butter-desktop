(function (App) {
    'use strict';

    var WatchlistCollection = App.Model.NullCollection.extend({
        initialize: function (model, options) {
            this.hasMore = false;
            this.providers = {
                torrents: [App.Providers.get('Watchlist')]
            };
        },
        fetch: function () {
            return App.Providers.get('Watchlist')
                .fetch()
                .then((items) => {
                    let watchlistProvider =  App.Providers.get('Watchlist');
                    for (var i in items.results) { //hack FIXME - #557
                        items.results[i].providers = {
                            torrent: watchlistProvider
                        };
                    }
                    this.add(items.results);
                    this.state = 'loaded';
                    this.trigger('loaded', this, this.state);
                }).catch((error) => {
                    this.state = 'error';
                    this.trigger('error', this, this.state);
                    console.error('WatchlistCollection.fetch()', error);
                });
        }
    });

    App.Model.WatchlistCollection = WatchlistCollection;
})(window.App);
