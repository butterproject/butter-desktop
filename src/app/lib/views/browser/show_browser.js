(function (App) {
    'use strict';

    var ShowBrowser = App.View.ButterBrowser.extend({
        collectionModel: App.Model.ShowCollection,
        filters: {
            genres: App.Config.genres_tv,
            sorters: App.Config.sorters_tv
        }
    });

    App.View.ShowBrowser = ShowBrowser;
})(window.App);
