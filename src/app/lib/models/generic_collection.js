(function (App) {
    'use strict';

    var _cache = {};

    var getDataFromProvider = function (providers, collection) {
        var deferred = Q.defer();
        var filters = Object.assign(collection.filter, {page: providers.torrent.page});
        providers.torrent.fetch(filters)
            .then(function (torrents) {
                // If a new request was started...
                _.each(torrents.results, function (movie) {
                    var id = movie[collection.popid];
                    /* XXX(xaiki): check if we already have this
                     * torrent if we do merge our torrents with the
                     * ones we already have and update.
                     */
                    var model = collection.get(id);
                    if (model) {
                        var ts = model.get('torrents');
                        _.extend(ts, movie.torrents);
                        model.set('torrents', ts);

                        return;
                    }

                    movie.providers = providers;
                });

                return deferred.resolve(torrents);
            })
            .catch(function (err) {
                collection.state = 'error';
                collection.trigger('error', collection, collection.state);
                console.error('ButterCollection.fetch() : torrentPromises mapping', err);
            });

        return deferred.promise;
    };

    var ButterCollection = Backbone.Collection.extend({
        popid: 'imdb_id',
        initialize: function (models, options) {
            this.providers = this.getProviders();

            //XXX(xaiki): this is a bit of hack
            this.providers.torrents.forEach(t => {
                t.hasMore = true;
                t.page = 1;
            });

            options = options || {};
            options.filter = options.filter || new App.Model.Filter();

            this.filter = _.clone(options.filter.attributes);
            this.hasMore = true;

            Backbone.Collection.prototype.initialize.apply(this, arguments);
        },

        fetch: function () {
            var self = this;

            if (this.state === 'loading' && !this.hasMore) {
                return;
            }

            this.state = 'loading';
            self.trigger('loading', self);

            var metadata = this.providers.metadata;
            var torrents = this.providers.torrents;

            var torrentPromises = torrents.filter(torrentProvider => (
                !torrentProvider.loading && torrentProvider.hasMore
            )).map((torrentProvider) => {
                var providers = {
                    torrent: torrentProvider,
                    metadata: metadata
                };

                torrentProvider.loading = true;
                return getDataFromProvider(providers, self)
                    .then(function (torrents) {
                        // set state, can't fail
                        torrentProvider.loading = false;
                        if (torrents.results.length !== 0) {
                            torrentProvider.page++;
                        } else {
                            torrentProvider.hasMore = false;
                        }

                        self.add(torrents.results
                                         .map(attrs => (
                                             App.Model.new(Object.assign(attrs, {idAttribute: torrentProvider.config.uniqueId}))
                                         )));

                        // set state, can't fail
                        self.trigger('sync', self);
                        self.state = 'loaded';
                        self.trigger('loaded', self, self.state);
                    });
            });
        },

        fetchMore: function () {
            this.fetch();
        }
    });

    function hackModelId(attrs) {
        var id = attrs.idAttribute || 'id';
        return attrs[id];
    }

    var getCollectionModelForProviderTab = function (tab) {
        if (_cache[tab]) {
            return _cache[tab];
        }

        var providers = App.Config.getProvidersForTabType(tab);
        if (!providers) { // it's probably not a provider tab
            return null;
        }

        _cache[tab] = ButterCollection.extend({
            popid: 'imdb_id',
            type: tab,
            modelId: hackModelId,
            getProviders: function () {
                return {
                    torrents: App.Config.getProvidersForTabType(tab),
                    metadata: App.Config.getProviderForType('metadata')
                };
            }
        });

        return _cache[tab];
    };

    var getCollectionModelForBuiltIn = function (tab) {
        if (_cache[tab]) {
            return _cache[tab];
        }

        var provider = App.Providers.get(tab);
        if (!provider) {
            console.error('Could not find a provider for: ', tab);
            return null;
        }

        _cache[tab] = ButterCollection.extend({
            popid: 'imdb_id',
            type: tab,
            modelId: hackModelId,
            getProviders: function () {
                return {
                    torrents: [provider]
                };
            }
        });

        return _cache[tab];
    };

    App.Model.registerBuiltInTab = function(tab, model) {
        _cache[tab] = model;
    };

    App.Model.getCollectionModelForTab = function (tab) {
        return getCollectionModelForProviderTab(tab) || getCollectionModelForBuiltIn(tab);
    };

    var NullCollection = Backbone.Collection.extend({
        fetch:     function () {},
        fetchMore: function () {}
    });

    App.Model.Collection = ButterCollection;
    App.Model.NullCollection = NullCollection;

})(window.App);
