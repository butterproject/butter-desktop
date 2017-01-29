(function (App) {
    'use strict';

    App.View.Settings = {};

    var ActionView = function(Parent, View) {
        const _onShow = View.onShow;

        View.onShow = function () {
            this.model.sync();

            if (_onShow) {
                _onShow.apply(this, arguments);
            }

            if (Parent.prototype.onShow) {
                Parent.prototype.onShow.apply(this, arguments);
            }
        };

        View.setValue = function(value){
            var key = this.model.id;
            Settings[key] = value;

            //save to db
            App.db.writeSetting({
                key: key,
                value: value
            }).then(this.model.sync)
                .then(this.model.apply)
                .then(() => (App.vent.trigger('settings:save')));
        };

        return Parent.extend(View);
    };

    App.View.Settings.Action = {};
    App.View.Settings.Action[App.Model.Settings.ActionTypes.SWITCH] =
        ActionView(Backbone.Marionette.ItemView, {
            template: '#settings-action-switch-tpl',
            events: {
                'change input': '_setValue'
            },
            _setValue: function(e) {
                var field = $(e.currentTarget);
                this.setValue.bind(this)(field.is(':checked'));
            },
        });

    App.View.Settings.Action[App.Model.Settings.ActionTypes.DROPDOWN] =
        ActionView(App.View.FilterDropdown, {
            template: '#settings-action-dropdown-tpl',
        });

    App.View.Settings.Action[App.Model.Settings.ActionTypes.COLOR] =
        ActionView(App.View.SelectorDropdown, {
            template: '#settings-action-dropdown-tpl',
        });

    App.View.Settings.Action[App.Model.Settings.ActionTypes.BUTTON] =
        ActionView(Backbone.Marionette.ItemView, {
            template: '#settings-action-button-tpl',
        });

    App.View.Settings.Action[App.Model.Settings.ActionTypes.TEXT] =
        ActionView(Backbone.Marionette.ItemView, {
            template: '#settings-action-text-tpl',
            events: {
                'change input': '_setValue'
            },
            _setValue: function(e) {
                var field = $(e.currentTarget);
                this.setValue.bind(this)(field.val());
            },
        });

    App.View.Settings.Action[App.Model.Settings.ActionTypes.NUMBER] =
        App.View.Settings.Action[App.Model.Settings.ActionTypes.TEXT];

    App.View.Settings.Action[App.Model.Settings.ActionTypes.LABEL] =
        App.View.Settings.Action[App.Model.Settings.ActionTypes.TEXT];

    App.View.Settings.Action[App.Model.Settings.ActionTypes.PASSWORD] =
        App.View.Settings.Action[App.Model.Settings.ActionTypes.TEXT].extend({
            template: '#settings-action-password-tpl',
        });

    App.View.Settings.Item = App.View.Generic(Backbone.Marionette.LayoutView, {
        template: '#settings-item-tpl',
        className: 'settings-row',
        regions: {
            Action: '.action-item'
        },
        onShow: function () {
            var model = this.model;
            var type  = this.model.get('type');
            this.showView(this.Action, new App.View.Settings.Action[type]({
                model: model
            }));
        }
    });

    App.View.Settings.TabContent = Backbone.Marionette.CollectionView.extend({
        childView: App.View.Settings.Item,
        className: 'settings-item',
    });

    App.View.Settings.SectionContent = App.View.Generic(Backbone.Marionette.LayoutView, {
        template: '#settings-section-tpl',
        className: 'settings-section-content',
        regions: {
            Content: '.content'
        },
        onShow: function () {
            var collection = this.model.get('collection');
            this.showView(this.Content, new App.View.Settings.TabContent({
                collection: collection
            }));

            var showIf = this.model.get('showIf');
            if (showIf && ! showIf()) {
                this.el.hidden = true;
            }
        },
    });

    App.View.Settings.SectionCollection = Backbone.Marionette.CollectionView.extend({
        childView: App.View.Settings.SectionContent,
        className: 'settings-section',
    });

    App.View.Settings.Tab = App.View.Generic(Backbone.Marionette.LayoutView, {
        template: '#settings-tab-tpl',
        regions: {
            Content: '.content'
        },
        onShow: function () {
            if (this.collection) {
                var collection = this.collection;
                this.showView(this.Content, new App.View.Settings.TabContent({
                    collection: collection
                }));
            } else {
                var sections = this.model.get('sections');
                this.showView(this.Content, new App.View.Settings.SectionCollection({
                    collection: sections
                }));
            }
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
                collection: model.get('collection'),
                sections: model.get('sections')
            };
        },
    });

    App.View.Settings.Container = App.View.Generic(Backbone.Marionette.LayoutView, {
        template: '#settings-container-tpl',
        className: 'settings-container-contain',
        ui: {
            success_alert: '.success_alert'
        },
        events: {
            'click .go-back': 'closeSettings',
            'click .help': 'showHelp',
            'click .keyboard': 'showKeyboard',
        },
        regions: {
            Collection: '.tab-content-wrapper'
        },
        onShow: function () {
            $('.filter-bar').hide();
            $('#movie-detail').hide();
            $('#header').addClass('header-shadow');
            $('.tooltipped').tooltip({
                delay: {
                    'show': 800,
                    'hide': 100
                }
            });

            this.bindAppEvent('settings:save', () => (
                this.ui.success_alert.show().delay(3000).fadeOut(400)
            ));

            this.bindShortCut('backspace',() => {
                App.vent.trigger('settings:close');
            });

            var collection = this.collection;
            this.showView(this.Collection, new App.View.Settings.Collection({
                collection: collection
            }));
        },
        onDestroy: function () {
            $('.filter-bar').show();
            $('#header').removeClass('header-shadow');
            $('#movie-detail').show();
        },
        closeSettings: function () {
            App.vent.trigger('settings:close');
        },
        showHelp: function () {
            App.vent.trigger('help:toggle');
        },
        showKeyboard: function () {
            App.vent.trigger('keyboard:toggle');
        }
    });

})(window.App);
