(function (App) {
    'use strict';

    var FavoriteBrowser = App.View.ButterBrowser.extend({
        filters: {
            types: App.Config.types_fav,
            sorters: App.Config.sorters_fav
        }
    });

    App.View.registerBuiltInTab('favorites', FavoriteBrowser);
})(window.App);
