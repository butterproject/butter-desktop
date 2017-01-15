(function (App) {
    'use strict';

    var _registry = {};

    var ContentItem = Backbone.Model.extend({
        events: {
            'change:torrents': 'updateHealth' //FIXME: code duplication, see initialize #581
        },
        idAttribute: 'imdb_id',

        initialize: function (attrs) {
            var providers = Object.assign(this.getProviders(), attrs.providers);
            this.set('providers', providers);

            providers.metadata &&
                providers.metadata.getImages(attrs)
                .then(this.set.bind(this))
                .catch(e => console.error('error loading metadata', e));

            this.updateHealth();
            this.on('change:torrents', this.updateHealth.bind(this)); //FIXME: code duplication, see model events #581
        },

        getProviders: function() {
            return {};
        },

        updateHealth: function () {
            var torrents = this.get('torrents');

            if (!torrents) {
                // FIXME: if we see this we're trying to render too soon #581
                console.error('updateHealth(): no torrent found, render() fired too soon');
                return false;
            }

            _.each(torrents, function (torrent) {
                torrent.health = Common.healthMap[Common.calcHealth(torrent)];
            });

            this.set('torrents', torrents, {
                silent: true
            });
        }
    });

    App.Model.register = function (type, model) {
        model.type = type;
        _registry[type] = model;
    };

    App.Model.getForType = function (type) {
        return _registry[type] || console.error('Asked for unknown type:', type);
    };

    App.Model.new = function (attrs) {
        var model = App.Model.getForType(attrs.type);
        return new model(attrs);
    };

    App.Model.ContentItem = ContentItem;
})(window.App);
