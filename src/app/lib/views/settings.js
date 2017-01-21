(function (App) {
    'use strict';

    App.View.Settings = {};

    App.View.Settings.Item = Backbone.Marionette.ItemView.extend({
        template: '#settings-item-tpl',
        className: 'settings-row',
    });

    App.View.Settings.TabContent = Backbone.Marionette.CollectionView.extend({
        childView: App.View.Settings.Item,
        className: 'settings-item',
    });

    App.View.Settings.Tab = App.View.Generic(Backbone.Marionette.LayoutView, {
        template: '#settings-tab-tpl',
        regions: {
            Content: '.content'
        },
        onShow: function () {
            var collection = this.collection;
            this.showView(this.Content, new App.View.Settings.TabContent({
                collection: collection
            }));
        },
        onRender: function () {
            // Get rid of that pesky wrapping-div.
            // Assumes 1 child element present in template.
            this.$el = this.$el.children();
            // Unwrap the element to prevent infinitely 
            // nesting elements during re-render.
            this.$el.unwrap();
            this.setElement(this.$el);
        }
    });

    App.View.Settings.Collection = Backbone.Marionette.CollectionView.extend({
        childView: App.View.Settings.Tab,
        className: 'tab-content',
        childViewOptions: function (model, index) {
            return {
                collection: model.get('collection')
            };
        },
    });

    App.View.Settings.Container = App.View.Generic(Backbone.Marionette.LayoutView, {
        template: '#settings-container-tpl',
        className: 'settings-container-contain',
        regions: {
            Collection: '.tab-content-wrapper'
                                   },
        onShow: function () {
            var collection = this.collection;
            this.showView(this.Collection, new App.View.Settings.Collection({
                collection: collection
            }));
        },
    });

})(window.App);
