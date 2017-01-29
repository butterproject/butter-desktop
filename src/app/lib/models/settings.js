(function (App) {
    'use strict';

    var ACTION_TYPES = {
        SWITCH:   'SETTINGS_ACTION_TYPES_SWITCH',
        DROPDOWN: 'SETTINGS_ACTION_TYPES_DROPDOWN',
        COLOR:    'SETTINGS_ACTION_TYPES_COLOR',
        BUTTON:   'SETTINGS_ACTION_TYPES_BUTTON',
        TEXT:     'SETTINGS_ACTION_TYPES_TEXT',
        NUMBER:   'SETTINGS_ACTION_TYPES_NUMBER',
        LABEL:    'SETTINGS_ACTION_TYPES_LABEL',
        PASSWORD: 'SETTINGS_ACTION_TYPES_PASSWORD',
    };

    App.Model.Settings = {};
    App.Model.Settings.ActionTypes = ACTION_TYPES;
    App.Model.Settings.Item = Backbone.Model.extend ({
        _sync: function() {
            let value = Settings[this.id];
            switch (this.get('type')) {
                case ACTION_TYPES.SWITCH:
                    this.set('checked', value);
                    break;
                case ACTION_TYPES.DROPDOWN:
                case ACTION_TYPES.COLOR:
                    value = value || this.get('options')[0];
                    this.set('selected', value);
                    break;
                case ACTION_TYPES.BUTTON:
                    break;
                case ACTION_TYPES.TEXT:
                case ACTION_TYPES.NUMBER:
                case ACTION_TYPES.LABEL:
                    value = value || this.get('value') || '';
                    this.set('value', value);
                    break;
                case ACTION_TYPES.PASSWORD:
                    break;
                default:
                    break;
            }
            return value;

        },
        initialize: function () {
            this.apply = (this.get('apply') || function () {}).bind(this);
            this.sync = this._sync.bind(this);
            this.sync();
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

    App.Model.Settings.SectionItem = Backbone.Model.extend ({
        idAttribute: 'id'
    });

    App.Model.Settings.SectionCollection = Backbone.Collection.extend ({
        model: App.Model.Settings.SectionItem
    });

    function arrayToi18nHash(a) {
        return a.reduce((a, c) => {
            a[c] = i18n.__(c);
            return a;
        }, {});
    }

    var GeneralSettings = {
        id: 'general',
        title: i18n.__('General'),
        collection: new App.Model.Settings.ItemCollection([{
            id: 'activateTorrentCollection',
            title: i18n.__('Torrent Collection'),
            helper: i18n.__('Display a view with your %s', 'Torrent Collection'),
            icon: 'collections_bookmark',
            type: ACTION_TYPES.SWITCH
        }, {
            id: 'activateWatchlist',
            title: i18n.__('Watchlist'),
            helper: i18n.__('Display a view with your %s', 'Watchlist'),
            icon: 'remove_red_eye',
            type: ACTION_TYPES.SWITCH
        }, {
            id: 'activateRandomize',
            title: i18n.__('Randomize Button For Movies'),
            helper: i18n.__('Display a button to select a Random Movie in the Current View'),
            icon: 'shuffle',
            type: ACTION_TYPES.SWITCH
        }, {
            id: 'movies_quality',
            title: i18n.__('Content Quality'),
            helper: i18n.__('Only show content in this quality'),
            icon: 'sort',
            type: ACTION_TYPES.DROPDOWN,
            options: arrayToi18nHash(['All', '1080p', '720p']),
            advanced: true
        }, {
            id: 'moviesShowQuality',
            title: i18n.__('Show Quality'),
            helper: i18n.__('Display Content Quality in List view'),
            icon: 'high_quality',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'alwaysFullscreen',
            title: i18n.__('FullScreen'),
            helper: i18n.__('Always start playback in FullScreen mode'),
            icon: 'fullscreen',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'playNextEpisodeAuto',
            title: i18n.__('Play Next'),
            helper: i18n.__('Automatically play next Episode'),
            icon: 'queue_play_next',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'connectionLimit',
            title: i18n.__('Connection Limit'),
            helper: i18n.__('Limit the amount of Outbound Connection %s will open', Settings.projectName),
            icon: 'settings_applications',
            type: ACTION_TYPES.NUMBER,
            advanced: true
        }, {
            id: 'streamPort',
            title: i18n.__('Stream Port'),
            helper: i18n.__('Port to stream on, randomlly choosen if 0'),
            icon: 'settings_applications',
            type: ACTION_TYPES.NUMBER,
            advanced: true
        }, {
            id: 'overallRatio',
            title: i18n.__('Overall Ratio'),
            helper: i18n.__('Downloaded so far: %s', Common.fileSize(Settings.totalDownloaded)),
            icon: 'settings_applications',
            type: ACTION_TYPES.LABEL,
            action_title: (Settings.totalUploaded / Settings.totalDownloaded).toFixed(2),
            advanced: true
        }, {
            id: 'cache-directory',
            title: i18n.__('%s Directory', 'Cache'),
            helper: i18n.__('Open the Directory where %s keeps it\'s %s', Settings.projectName, 'Cache'),
            icon: 'folder',
            type: ACTION_TYPES.BUTTON,
            action_title: i18n.__('Open'),
            advanced: true
        }, {
            id: 'deleteTmpOnClose',
            title: i18n.__('Clear %s', 'Cache'),
            helper: i18n.__('Delete temp folder after closing the App'),
            icon: 'delete',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'db-directory',
            title: i18n.__('%s Directory', 'Database'),
            helper: i18n.__('Open the Directory where %s keeps it\'s %s', Settings.projectName, 'Database'),
            icon: 'folder',
            type: ACTION_TYPES.BUTTON,
            action_title: i18n.__('Open'),
            advanced: true
        }, {
            id: 'db-import',
            title: i18n.__('Import %s', 'Database'),
            helper: i18n.__('Upload a %s for %s to use', 'Database', Settings.projectName),
            icon: 'file_download',
            type: ACTION_TYPES.BUTTON,
            action_title: i18n.__('Import'),
            advanced: true
        }, {
            id: 'db-export',
            title: i18n.__('Export %s', 'Database'),
            helper: i18n.__('export the %s, %s is currently using', 'Database', Settings.projectName),
            icon: 'file_upload',
            type: ACTION_TYPES.BUTTON,
            action_title: i18n.__('Export'),
            advanced: true
        }, {
            id: 'db-export',
            title: i18n.__('Export %s', 'Database'),
            helper: i18n.__('export the %s, %s is currently using', 'Database', Settings.projectName),
            icon: 'file_upload',
            type: ACTION_TYPES.BUTTON,
            action_title: i18n.__('Export'),
            advanced: true
        }, {
            id: 'tv_detail_jump_to',
            title: i18n.__('TV Detail Default'),
            helper: i18n.__('When Opening TV Detail jump to'),
            icon: 'exit_to_app',
            type: ACTION_TYPES.DROPDOWN,
            options: {
                firstUnwatched: 'First Unwatched Episode',
                next: 'Next Episode In Series'
            },
            advanced: true
        }, {
            id: 'automaticUpdating',
            title: i18n.__('Update %s', Settings.projectName),
            helper: i18n.__('Automatically fetch and apply updates'),
            icon: 'update',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'events',
            title: i18n.__('Celebrate'),
            helper: i18n.__('Show icons celebrating various events'),
            icon: 'cake',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'minimizeToTray',
            title: i18n.__('Minimize to Tray'),
            helper: i18n.__('Show an icon to minimize in the top bar'),
            icon: 'settings_applications',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'bigPicture',
            title: i18n.__('Big Pictures'),
            helper: i18n.__('Show all pictures a tad bigger'),
            icon: 'aspect_ratio',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }])
    };

    var InterfaceSettings = {
        id: 'interface',
        title: i18n.__('Interface'),
        collection: new App.Model.Settings.ItemCollection([{
            id: 'language',
            title: i18n.__('Default Language'),
            helper: i18n.__('Display the interface and metadata in this language (if available)'),
            icon: 'language',
            type: ACTION_TYPES.DROPDOWN,
            options: Object.keys(App.Localization.langcodes)
                           .filter(key => (App.Localization.langcodes[key]))
                           .reduce((a, key) => {
                               a[key] = App.Localization.langcodes[key].nativeName;
                               return a;
                           }, {})
        }, {
            id: 'theme',
            title: i18n.__('Theme'),
            helper: i18n.__('Select a different Look&Feel for the App'),
            icon: 'format_paint',
            type: ACTION_TYPES.DROPDOWN,
            options: App.Themes,
            apply: (value) => {
                console.error('APPLY', value);
                $('link#theme').attr('href', 'themes/' + value);
                App.vent.trigger('updatePostersSizeStylesheet');
            }
        }, {
            id: 'watchedCovers',
            title: i18n.__('Watched Items'),
            helper: i18n.__('Select how to display %s', 'Watched Items'),
            icon: 'visibility',
            type: ACTION_TYPES.DROPDOWN,
            options: {
                none: 'Show',
                fade: 'Fade',
                hide: 'Hide'
            }
        }, {
            id: 'start_screen',
            title: i18n.__('Start Screen'),
            helper: i18n.__('Select the view the App should start on'),
            icon: 'home',
            type: ACTION_TYPES.DROPDOWN,
            options: arrayToi18nHash(['Movies','TV Series','Anime','Indie','Favorites', 'Watchlist', 'Last Open']),
            advanced: true
        }, {
            id: 'translateSynopsis',
            title: i18n.__('Translate Synopsis'),
            helper: i18n.__('Should we try to translate sysopsises'),
            icon: 'translate',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'coversShowRating',
            title: i18n.__('Show Rating'),
            helper: i18n.__('Display Rating info on top of Covers'),
            icon: 'star_rate',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'alwaysOnTop',
            title: i18n.__('Always On Top'),
            helper: i18n.__('Keep App above other'),
            icon: 'settings_applications',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }, {
            id: 'rememberFilters',
            title: i18n.__('Remember Filters'),
            helper: i18n.__('Restore your filters on App restart'),
            icon: 'sort',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }
        ])
    };

    var SubtitlesSettings = {
        id: 'subtitles',
        title: i18n.__('Subtitles'),
        collection: new App.Model.Settings.ItemCollection([{
            id: 'subtitle_language',
            title: i18n.__('Default Subtitle'),
            helper: i18n.__('Auto-Select this subtitle language by default if available'),
            icon: 'subtitles',
            type: ACTION_TYPES.DROPDOWN,
            options: Object.keys(App.Localization.langcodes)
                           .filter(key => (
                               App.Localization.langcodes[key].subtitle !== undefined &&
                               App.Localization.langcodes[key].subtitle === true))
                           .reduce((a, key) => {
                               a[key] = App.Localization.langcodes[key].nativeName;
                               return a;
                           }, {})
        }, {
            id: 'subtitle_size',
            title: i18n.__('Size'),
            helper: i18n.__('Select the default Font Size for %s', 'Subtitles'),
            icon: 'format_size',
            type: ACTION_TYPES.DROPDOWN,
            options: ['20px','22px','24px','26px','28px','30px','32px','34px','36px','38px','40px','42px','44px','46px','48px','50px','52px','54px','56px','58px','60px']
        }, {
            id: 'subtitle_font',
            title: i18n.__('Font'),
            helper: i18n.__('Select the default Font for %s', 'Subtitles'),
            icon: 'format_shapes',
            type: ACTION_TYPES.DROPDOWN,
            options: App.Localization.subFonts,
            advanced: true
        }, {
            id: 'subtitle_decoration',
            title: i18n.__('Decoration'),
            helper: i18n.__('%s text decorations', 'Subtitles'),
            icon: 'format_color_text',
            type: ACTION_TYPES.DROPDOWN,
            options: arrayToi18nHash(['None', 'Outline', 'Opaque Background', 'See-through Background']),
            advanced: true
        }, {
            id: 'subtitle_color',
            title: i18n.__('Color'),
            helper: i18n.__('%s text color', 'Subtitles'),
            icon: 'color_lens',
            type: ACTION_TYPES.COLOR,
            options: [
                '#ffffff',
                '#ffff00',
                '#ff0000',
                '#ff00ff',
                '#00ffff',
                '#00ff00',
            ],
            advanced: true
        }, {
            id: 'subtitle_bold',
            title: i18n.__('Bold'),
            helper: i18n.__('Display %s using Bold Font', 'Subtitles'),
            icon: 'format_bold',
            type: ACTION_TYPES.SWITCH,
            advanced: true
        }
        ])
    };

    var ExtensionsSettings = {
        id: 'extensions',
        title: i18n.__('Extensions'),
        sections: new App.Model.Settings.SectionCollection([{
            id: 'remote-control',
            title: i18n.__('Remote Control'),
            advanced: true,
            collection: new App.Model.Settings.ItemCollection([{
                id: 'settingsIpAddress',
                title: i18n.__('IP Address'),
                helper: i18n.__('Set this machine\'s IP Address'),
                icon: 'location_on',
                type: ACTION_TYPES.TEXT,
            }, {
                id: 'httpApiPort',
                title: i18n.__('%s Port', 'HTTP API'),
                helper: i18n.__('Port to use for %s', 'HTTP API'),
                icon: 'http',
                type: ACTION_TYPES.NUMBER,
            }, {
                id: 'httpApiUsername',
                title: i18n.__('%s Username', 'HTTP API'),
                helper: i18n.__('Username To use for %s', 'HTTP API'),
                icon: 'account_box',
                type: ACTION_TYPES.TEXT,
            }, {
                id: 'httpApiUsername',
                title: i18n.__('%s Username', 'HTTP API'),
                helper: i18n.__('Username To use for %s', 'HTTP API'),
                icon: 'account_box',
                type: ACTION_TYPES.PASSWORD,
            }, {
                id: 'qrCodeGen',
                title: i18n.__('QR Code'),
                helper: i18n.__('Generate Pairing QR Code'),
                icon: 'lock',
                type: ACTION_TYPES.BUTTON,
                action_title: i18n.__('Get Code')
            }
            ])
        }, {
            id: 'trakt-connected',
            title: 'Trakt.tv',
            showIf: (() => (App.Trakt.authenticated)),
            collection: new App.Model.Settings.ItemCollection([{
                id: 'trakt-connected',
                title: i18n.__('You are currently connected to %s', 'Trakt.tv'),
                helper: i18n.__('%s connection state', 'Trakt.tv'),
                icon: 'verified_user',
                type: ACTION_TYPES.BUTTON,
                action_title: 'Disconnect Account'
            }, {
                id: 'traktSyncOnStart',
                title: i18n.__('Sync on Start'),
                helper: i18n.__('Automatically sync %s on App Start', 'Trakt.tv'),
                icon: 'settings_applications',
                type: ACTION_TYPES.SWITCH,
            }, {
                id: 'traktPlayback',
                title: i18n.__('Resume Playback'),
                helper: i18n.__('Restart your %s tracked media from where you left them', 'Trakt.tv'),
                icon: 'settings_applications',
                type: ACTION_TYPES.SWITCH,
            }, {
                id: 'traktSync',
                title: i18n.__('Sync with %s', 'Trakt.tv'),
                helper: i18n.__('%s sync master switch', 'Trakt.tv'),
                icon: 'sync',
                type: ACTION_TYPES.SWITCH,
            }])
        }, {
            id: 'trakt-not-connected',
            title: 'Trakt.tv',
            showIf: (() => (! App.Trakt.authenticated)),
            collection: new App.Model.Settings.ItemCollection([{
                id: 'traktConnectTo',
                title: i18n.__('Connect to %s', 'Trakt.tv'),
                helper: i18n.__('Use OAuth to authenticate'),
                icon: 'insert_link',
                type: ACTION_TYPES.BUTTON,
                action_title: 'Connect'
            }])
        }, {
            id: 'tvshowtime-connected',
            title: 'TVShow Time',
            showIf: (() => (App.TVShowTime.authenticated)),
            collection: new App.Model.Settings.ItemCollection([{
                id: 'tvshowtime-connected',
                title: i18n.__('You are currently connected to %s', 'TVShow Time'),
                helper: i18n.__('%s connection state', 'TVShow Time'),
                icon: 'verified_user',
                type: ACTION_TYPES.BUTTON,
                action_title: 'Disconnect Account'
            }])
        }, {
            id: 'tvshowtime-not-connected',
            title: 'TVShow Time',
            showIf: (() => (! App.TVShowTime.authenticated)),
            collection: new App.Model.Settings.ItemCollection([{
                id: 'tvshowtime-connect',
                title: i18n.__('Connect to %s', 'TVShow Time'),
                helper: i18n.__('Use OAuth to authenticate'),
                icon: 'insert_link',
                type: ACTION_TYPES.BUTTON,
                action_title: 'Connect'
            }])
        }, {
            id: 'opensubtitles-connected',
            title: 'Open Subtitles',
            showIf: (() => (Settings.opensubtitlesAuthenticated)),
            collection: new App.Model.Settings.ItemCollection([{
                id: 'opensubtitles-connected',
                title: i18n.__('You are currently connected to %s', 'OpenSubtitles'),
                helper: i18n.__('%s connection state', 'OpenSubtitles'),
                icon: 'verified_user',
                type: ACTION_TYPES.BUTTON,
                action_title: 'Disconnect Account'
            }, {
                id: 'opensubtitlesAutoUpload',
                title: i18n.__('Subtitle Upload'),
                helper: i18n.__('Automatically upload user-selected subtitles to %s', 'OpenSubtitles'),
                icon: 'verified_user',
                type: ACTION_TYPES.BUTTON,
                action_title: 'Disconnect Account'
            }])
        }, {
            id: 'opensubtitles-not-connected',
            title: 'TVShow Time',
            showIf: (() => (! Settings.opensubtitlesAuthenticated)),
            collection: new App.Model.Settings.ItemCollection([{
                id: 'opensubtitles-username',
                title: i18n.__('%s Username', 'OpenSubtitles'),
                helper: i18n.__('Username you use to connect to %s', 'OpenSubtitles'),
                icon: 'account_box',
                type: ACTION_TYPES.TEXT,
            }, {
                id: 'opensubtitles-password',
                title: i18n.__('%s Password', 'OpenSubtitles'),
                helper: i18n.__('Password you use to connect to %s', 'OpenSubtitles'),
                icon: 'lock',
                type: ACTION_TYPES.PASSWORD,
            }, {
                id: 'opensubtitles-connect',
                title: i18n.__('Connect to %s', 'OpenSubtitles'),
                helper: i18n.__('%s stores an encrypted hash of your password in your local database', Settings.projectName),
                icon: 'link',
                type: ACTION_TYPES.BUTTON,
                action_title: 'Connect'
            }])
        }])
    };

    App.Model.Settings.Collection = new App.Model.Settings.TabCollection([
        GeneralSettings,
        InterfaceSettings,
        SubtitlesSettings,
        ExtensionsSettings
    ]);
})(window.App);
