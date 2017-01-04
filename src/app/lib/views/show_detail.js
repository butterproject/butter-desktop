(function(App) {
    'use strict';

    App.View.ShowHeader = Backbone.Marionette.ItemView.extend({
        template: '#show-header-tpl',
        className: 'show-header'
    });

    App.View.ShowDetail = App.View.GenericDetail.extend({
        regions: {
            ActionBar:  '#action-bar',
            ShowHeader: '#show-header',
            DetailMeat: '#detail-meat'
        },
        initialize: function () {
            App.View.GenericDetail.prototype.initialize.call(this, arguments);

            var torrents = {};
            this.model.get('episodes').map((value) => {
                if (!torrents[value.season]) {
                    torrents[value.season] = {};
                }
                torrents[value.season][value.episode] = value;
            });
            this.model.set('torrents', torrents);
        },
        loadComponents: function() {
            this.showView(this.ActionBar, new App.View.ActionBar({
                model: this.model
            }));

            this.showView(this.ShowHeader, new App.View.ShowHeader({
                model: this.model
            }));

            this.showView(this.DetailMeat, new App.View.DetailMeat({
                model: this.model
            }));
        }
    });
})(window.App);
