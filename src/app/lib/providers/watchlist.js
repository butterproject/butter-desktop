(function (App) {
    'use strict';

    const Provider = require('butter-provider')
    const moment = require('moment')
    const debug = require('debug')('butter-provider-watchlist')

    const defaultConfig = {
        uniqueId: 'imdb_id',
        name: 'watchlist',
        tabName: 'Watchlist'
    }

    function rearrangeShows(shows) {
        return shows.sort((a, b) => {
            if (a.episode_aired > b.episode_aired) {
                return -1;
            }
            if (a.episode_aired < b.episode_aired) {
                return 1;
            }

            return 0;
        })
    }

    function rearrangeMovies(movies) {
        return movies.sort((a, b) => {
            if (a.listed_at < b.listed_at) {
                return -1;
            }
            if (a.listed_at > b.listed_at) {
                return 1;
            }

            return 0;
        })
    }

    function rearrange(items) {
        var movies = [],
            shows = [];

        return Promise.all(items.map((item) => {
            if (!item) {
                return null;
            }

            if (item.first_aired) {
                return shows.push(item)
            }

            return movies.push(item)
        })).then(() => (rearrangeShows(shows).concat(rearrangeMovies(movies))));
    }

    function formatShow(item) {
        return Object.assign(item.show, {
            type: 'show',
            episode: item.next_episode.number,
            season: item.next_episode.season,
            episode_title: item.next_episode.title,
            episode_id: item.next_episode.ids.tvdb,
            episode_aired: item.next_episode.first_aired,
            imdb_id: item.show.ids.imdb,
            tvdb_id: item.show.ids.tvdb,
            rating: item.show.rating,
            title: item.show.title,
            trailer: item.show.trailer,
            unseen: item.unseen
        })
    }

    function formatMovie(item) {
        return Object.assign(item.movie, {
            type: 'movie',
            listed_at: item.listed_at,
            imdb_id: item.movie.ids.imdb,
            rating: item.movie.rating,
            title: item.movie.title,
            trailer: item.movie.trailer,
            year: item.movie.year
        })
    }

    function format(items) {
        var itemList = [];

        return Promise.all(items.map((item) => {
            if (item.next_episode) {
                if (moment(item.next_episode.first_aired).fromNow().indexOf('in') !== -1) {
                    return debug('"%s" is not released yet, not showing', `${item.show.title} ${item.next_episode.season}x${item.next_episode.number}`);
                }

                return itemList.push(formatShow(item));
            }

            // movie
            if (moment(item.movie.released).fromNow().indexOf('in') !== -1) {
                return debug('"%s" is not released yet, not showing', item.movie.title);
            }

            return itemList.push(formatMovie(item));

        })).then(() => Promise.all(itemList
            .map((item, idx) => App.Trakt.client.images.get(item)
                                   .then((imgs) => {
                                       itemList[idx].poster = imgs.poster;
                                       itemList[idx].backdrop = imgs.background;
                                   })))).then(() => itemList);
    }

    function load() {
        Reflect.deleteProperty(localStorage.watchlist_fetched_time)
        Reflect.deleteProperty(localStorage.watchlist_cached)
        Reflect.deleteProperty(localStorage.watchlist_update_shows)
        Reflect.deleteProperty(localStorage.watchlist_update_movies)

        var watchlist = [];

        return App.Trakt.client.ondeck.getAll().then((tv) => {
            // store update data
            localStorage.watchlist_update_shows = JSON.stringify(tv);

            // add tv show to watchlist
            watchlist = watchlist.concat(tv.shows);

            return App.Trakt.client.sync.watchlist.get({
                extended: 'full',
                type: 'movies'
            });
        }).then((movies) => {
            // store update data
            localStorage.watchlist_update_movies = JSON.stringify(movies);

            // add movies to watchlist
            watchlist = watchlist.concat(movies);

            return format(watchlist);
        }).then(rearrange).then((items) => {
            // store fetched timestamp
            localStorage.watchlist_fetched_time = Date.now();

            // cache watchlist
            localStorage.watchlist_cached = JSON.stringify(items);

            return {
                results: items,
                hasMore: false
            };
        });
    }

    function update(id) {
        var update_data = JSON.parse(localStorage.watchlist_update_shows);
        Reflect.deleteProperty(localStorage.watchlist_fetched_time)
        Reflect.deleteProperty(localStorage.watchlist_cached)
        Reflect.deleteProperty(localStorage.watchlist_update_shows)

        var watchlist = [];

        return App.Trakt.client.ondeck.updateOne(update_data, id).then((tv) => {
            // store update data
            localStorage.watchlist_update_shows = JSON.stringify(tv);

            // add tv show & movies to watchlist
            watchlist = JSON.parse(localStorage.watchlist_update_movies).concat(tv.shows);

            return format(watchlist);
        }).then(rearrange).then((items) => {
            // store fetched timestamp
            localStorage.watchlist_fetched_time = Date.now();

            // cache watchlist
            localStorage.watchlist_cached = JSON.stringify(items);

            return {
                results: items,
                hasMore: false
            };
        });
    }

    class Watchlist extends Provider {
        constructor(args, config = defaultConfig) {
            super(args, config)
        }

        detail() {
            return Promise.reject(new Error('No details for watchlist'));
        }

        fetch(filters = {}) {
            return new Promise((resolve, reject) => {
                if (filters && typeof filters !== 'function' && (filters.force || filters.update)) {
                    if (filters.update && localStorage.watchlist_update_shows) {
                        debug('Watchlist - update one item');

                        return update(filters.update).then(resolve).catch(reject);
                    } else if (filters.force) {
                        debug('Watchlist - force reload');

                        return load().then(resolve).catch(reject);
                    }
                    debug('Watchlist - this should not be called', filters);

                    return reject(new Error('SHOULDNT BE CALLED'));

                }
                // cache is 4 hours
                if (!localStorage.watchlist_cached || parseInt(localStorage.watchlist_fetched_time, 10) + 14400000 < Date.now()) {
                    debug('Watchlist - no watchlist cached or cache expired');
                    if (App.Trakt.authenticated) {
                        return App.Providers.get('Watchlist').fetch({force: true}).then(resolve).catch(reject);
                    }

                    return reject(new Error('Trakt not authenticated'));

                }

                debug('Watchlist - return cached');

return resolve({
                    results: JSON.parse(localStorage.watchlist_cached),
                    hasMore: false
                });
            });
        }
    }

    function onShowWatched(show, channel) {
        if (channel === 'database') {
            setTimeout(() => {
                App.Providers.get('Watchlist').fetch({
                    update: show.imdb_id
                }).then(() => {
                    if (App.currentview === 'watchlist') {
                        App.vent.trigger('watchlist:list');
                    }
                });
            }, 3000);
        }
    }

    App.vent.on('show:watched', onShowWatched);

    App.Providers.install(Watchlist);
}(window.App));
