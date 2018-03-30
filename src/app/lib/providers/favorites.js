(function (App) {
    'use strict';

    const Provider = require('butter-provider');

    const defaultConfig = {
        name: 'favorites',
        tabName: 'Favorites',
    }

    function sort(items, filters) {
        var sorted = [],
            matched;

        if (filters.sorter === 'title') {
            sorted = items.sort(function (a, b) {
                var A = a.title.toLowerCase();
                var B = b.title.toLowerCase();
                if (A < B) {
                    return -1 * filters.order;
                } else if (A > B) {
                    return 1 * filters.order;
                } else {
                    return 0;
                }
            });
        }

        if (filters.sorter === 'rating') {
            sorted = items.sort(function (a, b) {
                var a_rating = a.type === 'bookmarkedmovie' ? a.rating : (a.rating.percentage / 10);
                var b_rating = b.type === 'bookmarkedmovie' ? b.rating : (b.rating.percentage / 10);
                return filters.order === -1 ? b_rating - a_rating : a_rating - b_rating;
            });
        }

        if (filters.sorter === 'year') {
            sorted = items.sort(function (a, b) {
                return filters.order === -1 ? b.year - a.year : a.year - b.year;
            });
        }

        if (filters.sorter === 'watched items') {
            sorted = items.sort(function (a, b) {
                var a_watched = App[a.type === 'bookmarkedmovie' ? 'watchedMovies' : 'watchedShows'].indexOf(a.imdb_id) !== -1;
                var b_watched = App[b.type === 'bookmarkedmovie' ? 'watchedMovies' : 'watchedShows'].indexOf(b.imdb_id) !== -1;
                return filters.order === -1 ? a_watched - b_watched : b_watched - a_watched;
            });
        }

        if (filters.type !== 'All') {
            matched = [];
            for (var i in sorted) {
                if (sorted[i].imdb_id.indexOf('mal') !== -1) {
                    matched.push(sorted[i]);
                }
            }

            if (filters.type === 'Anime') {
                sorted = matched;
            } else {
                for (var j in matched) {
                    for (var k = sorted.length; k--;) {
                        if (sorted[k] === matched[j]) {
                            sorted.splice(k, 1);
                        }
                    }
                }
            }
        }

        if (filters.keywords) {
            var query = filters.keywords.toLowerCase();
            matched = [];
            for (var l in sorted) {
                if (sorted[l].title.toLowerCase().indexOf(query) !== -1) {
                    matched.push(sorted[l]);
                }
            }
            sorted = matched;
        }

        return sorted;
    }
    function queryTorrents(filters = {}) {
        return App.db.getBookmarks(filters)
                  .catch(() => ([]))
    }

    function getMovie(movie) {
        return  Database.getMovie(movie.imdb_id)
                        .then((data) => (Object.assign({}, data, {
                            type: 'bookmarkedmovie'
                        })))
    }

    function getTVShow(show) {
        var _data = null;
        Database.getTVShowByImdb(movie.imdb_id)
                .then((data) => {
                    if (! data) {
                        return new Error('No Data')
                    }

                    data.type = 'bookmarkedshow';
                    data.imdb = data.imdb_id;
                    // Fallback for old bookmarks without provider in database or marked as Eztv
                    if (typeof (data.provider) === 'undefined'
                        || data.provider === 'Eztv') {
                        data.provider = 'TVApi';
                    }

                    // Cache new show and return
                    Database.deleteBookmark(_data.imdb_id);
                    Database.deleteTVShow(_data.imdb_id);
                    Database.addTVShow(data);
                    Database.addBookmark(data.imdb_id, 'tvshow');
                    data.type = 'bookmarkedshow';

                    return data
                }).catch((err) => {
                    // Show no longer exists on provider
                    // Scrub bookmark and TV show
                    // But return previous data one last time
                    // So error to erase database doesn't show
                    Database.deleteBookmark(_data.imdb_id);
                    Database.deleteTVShow(_data.imdb_id);
                });
    }

    function formatForButter(items) {
        const movieList = items.map((movie) => {
            return new Promise((resolve, reject) => {
                // we check if its a movie
                // or tv show then we extract right data
                (() => {
                    if (movie.type === 'movie') {
                        return getMovie(movie)
                    } else {
                        return getShow(movie)
                    }
                })().then(resolve)
                    .catch(reject)
            })
        });

        return Promise.all(movieList);
    }

    class Favorites extends Provider {
        constructor (args, config = defaultConfig) {
            super(args, config)
        }

        fetch(filters = {}) {
            var params = {
                page: filters.page
            };
            if (filters.type === 'TV') {
                params.type = 'tvshow';
            }
            if (filters.type === 'Movies') {
                params.type = 'movie';
            }

            return queryTorrents(params)
                .then(formatForButter)
                .then(items => (sort(items, filters)))
                .then(results => ({results: results, hasMore: true}));
        }
    }

    App.Providers.install(Favorites);
})(window.App);
