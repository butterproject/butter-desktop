(function (App) {
    'use strict';

    var MovieBrowser = App.View.ButterBrowser.extend({
        collectionModel: App.Model.MovieCollection,
        filters: {
            genres: App.Config.genres,
            sorters: App.Config.sorters
        }
    });

    App.View.MovieBrowser = MovieBrowser;
})(window.App);
