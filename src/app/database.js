(function (App) {
    'use strict';

    var startupTime = window.performance.now();
    App.DatabaseHelpers = {
        getUserInfo: function () {
            var dbs = App.Databases
            var bookmarks = dbs.bookmarks.find()
                .then(function (data) {
                    App.userBookmarks = data;
                });

            var movies = dbs.movies.getWatched()
                .then(function (data) {
                    App.watchedMovies = extractMovieIds(data);
                });

            var episodes = dbs.shows.getWatched()
                .then(function (data) {
                    App.watchedShows = extractIds(data)
                });

            return Q.all([bookmarks, movies, episodes]);
        },

        deleteDatabases: function () {
            Databases.keys().map(function (name) {
                fs.unlinkSync(path.join(data_path, 'data/'+name+'.db'));
            })

            return Q.Promise(function (resolve, reject) {
                var req = indexedDB.deleteDatabase(App.Config.cache.name);
                req.onsuccess = function () {
                    resolve();
                };
                req.onerror = function () {
                    resolve();
                };
            });

        },

        initialize: function () {
            // we'll intiatlize our settings and our API SSL Validation
            // we build our settings array
            return App.bootstrapPromise
                .then(App.DatabaseHelpers.getUserInfo)
                .then(App.Databases.settings.find)
                .then(function (data) {
                    if (data !== null) {
                        for (var key in data) {
                            Settings[data[key].key] = data[key].value;
                        }
                    } else {
                        win.warn('is it possible to get here');
                    }

                    // new install?
                    if (Settings.version === false) {
                        window.__isNewInstall = true;
                    }

                    App.vent.trigger('initHttpApi');

                    /*return AdvSettings.checkApiEndpoints([
                      Settings.updateEndpoint
                      ]);*/
                })
                .then(function () {
                    // set app language
                    window.setLanguage(Settings.language);
                    // set hardware settings and usefull stuff
                    return AdvSettings.setup();
                })
                .then(function () {
                    App.Trakt = App.Config.getProviderForType('metadata');

                    App.TVShowTime = App.Config.getProviderForType('tvst');
                    App.TVShowTime.restoreToken();

                    // check update
                    var updater = new App.Updater();

                    updater.update()
                        .catch(function (err) {
                            win.error('updater.update()', err);
                        });

                })
                .catch(function (err) {
                    win.error('Error starting up', err);
                });
        }
    };

    var WatchedDatabase = new Database({id: 'key', name: 'watched'})
    App.Databases = [
        new BookmarksDatabase(),
        new SettingsDatabase(),
        new ShowsDatabase({watchedDb: WatchedDatabase}),
        new MoviesDatabase({watchedDb: WatchedDatabase}),
        WatchedDatabase
    ].reduce(function (o, v) {
        o[v.get('name')] = v;
        return o;
    }, {})
})(window.App);
