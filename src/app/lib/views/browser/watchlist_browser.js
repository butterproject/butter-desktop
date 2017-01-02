(function (App) {
    'use strict';

    var WatchlistBrowser = App.View.ButterBrowser.extend({
        filters: null
    });

    App.View.registerBuiltInTab('watchlist', WatchlistBrowser);
})(window.App);
