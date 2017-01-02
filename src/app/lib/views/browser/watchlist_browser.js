(function (App) {
    'use strict';

    var WatchlistBrowser = App.View.ButterBrowser.extend({
        collectionModel: App.Model.WatchlistCollection
    });

    App.View.registerBuiltInTab('watchlist', WatchlistBrowser);
})(window.App);
