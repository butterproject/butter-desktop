(function (App) {
    'use strict';

    var ACTION_TYPES = {
        SWITCH:   'SETTINGS_ACTION_TYPES_SWITCH',
        DROPDOWN: 'SETTINGS_ACTION_TYPES_DROPDOWN',
        COLOR:    'SETTINGS_ACTION_TYPES_COLOR',
        BUTTON:   'SETTINGS_ACTION_TYPES_BUTTON',
        TEXT:     'SETTINGS_ACTION_TYPES_TEXT',
        PASSWORD: 'SETTINGS_ACTION_TYPES_PASSWORD',
    };

    App.Model.Settings = {};
    App.Model.Settings.ActionTypes = ACTION_TYPES;
    App.Model.Settings.Item = Backbone.Model.extend ({
        initialize: function(attrs) {
            switch (this.get('type')) {
                case ACTION_TYPES.SWITCH:
                    this.set('checked', false);
                    break;
                case ACTION_TYPES.DROPDOWN:
                    var selected = this.get('selected');
                    if (! selected) {
                        this.set('selected', this.get('options')[0]);
                    }
                    break;
                case ACTION_TYPES.COLOR:
                    break;
                case ACTION_TYPES.BUTTON:
                    break;
                case ACTION_TYPES.TEXT:
                    break;
                case ACTION_TYPES.PASSWORD:
                    break;
                default:
                    break;
            }
        }
    });

    App.Model.Settings.ItemCollection = Backbone.Collection.extend ({
        model: App.Model.Settings.Item
    });

    App.Model.Settings.TabItem = Backbone.Model.extend ({
        idAttribute: 'id'
    });

    App.Model.Settings.TabCollection = Backbone.Collection.extend ({
        model: App.Model.Settings.TabItem
    });

    App.Model.Settings.Collection = new App.Model.Settings.TabCollection([{
        id: 'general',
        title: 'General',
        collection: new App.Model.Settings.ItemCollection([{
            title: 'Torrent Collection',
            helper: 'Display a view with your Torrent Collection.',
            icon: 'collections_bookmark',
            type: ACTION_TYPES.SWITCH
        }, {
            title: 'Watchlist',
            helper: 'Display a view with your Watchlist.',
            icon: 'remove_red_eye',
            type: ACTION_TYPES.SWITCH
        }, {
            title: 'Randomize Button For Movies',
            helper: 'Display a button to select a Random Movie in the Current View.',
            icon: 'shuffle',
            type: ACTION_TYPES.SWITCH
        }
        ])
    }, {
        id: 'interface',
        title: 'Interface',
        collection: new App.Model.Settings.ItemCollection([{
            title: 'Default Language',
            helper: 'Display the interface and metadata in this language (if available)',
            icon: 'language',
            type: ACTION_TYPES.DROPDOWN,
            options: ['FIXME'],
        }, {
            title: 'Theme',
            helper: 'Select a different Look&Feel for the App',
            icon: 'format_paint',
            type: ACTION_TYPES.DROPDOWN,
            options: ['FIXME'],
        }, {
            title: 'Watched Items',
            helper: 'Select how to display Watched Items',
            icon: 'visibility',
            type: ACTION_TYPES.DROPDOWN,
            options: ['FIXME']
        }
        ])
    }, {
        id: 'subtitles',
        title: 'Subtitles',
        collection: new App.Model.Settings.ItemCollection([{
            title: 'Default Subtitle',
            helper: 'Auto-Select this subtitle language by default if available',
            icon: 'subtitles',
            type: ACTION_TYPES.DROPDOWN,
            options: ['FIXME'],
        }, {
            title: 'Size',
            helper: 'Select the default Font Size for the Subtitles',
            icon: 'format_size',
            type: ACTION_TYPES.DROPDOWN,
            options: ['FIXME'],
        }
        ])
    }, {
        id: 'extensions',
        title: 'Extensions',
    }, {
        id: 'providers',
        title: 'Providers',
    }

    ]);
})(window.App);
