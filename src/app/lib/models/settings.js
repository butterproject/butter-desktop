(function (App) {
    'use strict';

    var ACTION_TYPES = require('butter-action-types');

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
        idAttribute: 'id',
        defaults: { active: false }
    });

    App.Model.Settings.TabCollection = Backbone.Collection.extend ({
        model: App.Model.Settings.TabItem,
        initialize: function () {
            this.on('add', () => (this.models[0].set('active', true)));
        }
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
        items: [{
            id: 'activateTorrentCollection',
            title: i18n.__('Torrent Collection'),
            helper: i18n.__('Display a view with your %s', 'Torrent Collection'),
            icon: 'collections_bookmark',
            action: {
                type: ACTION_TYPES.SWITCH
            }
        }, {
            id: 'activateWatchlist',
            title: i18n.__('Watchlist'),
            helper: i18n.__('Display a view with your %s', 'Watchlist'),
            icon: 'remove_red_eye',
            action: {
                type: ACTION_TYPES.SWITCH
            }
        }, {
            id: 'activateRandomize',
            title: i18n.__('Randomize Button For Movies'),
            helper: i18n.__('Display a button to select a Random Movie in the Current View'),
            icon: 'shuffle',
            action: {
                type: ACTION_TYPES.SWITCH
            }
        }, {
            id: 'movies_quality',
            title: i18n.__('Content Quality'),
            helper: i18n.__('Only show content in this quality'),
            icon: 'sort',
            advanced: true,
            action: {
                type: ACTION_TYPES.DROPDOWN,
                options: arrayToi18nHash(['All', '1080p', '720p'])
            }
        }, {
            id: 'moviesShowQuality',
            title: i18n.__('Show Quality'),
            helper: i18n.__('Display Content Quality in List view'),
            icon: 'high_quality',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'alwaysFullscreen',
            title: i18n.__('FullScreen'),
            helper: i18n.__('Always start playback in FullScreen mode'),
            icon: 'fullscreen',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'playNextEpisodeAuto',
            title: i18n.__('Play Next'),
            helper: i18n.__('Automatically play next Episode'),
            icon: 'queue_play_next',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'connectionLimit',
            title: i18n.__('Connection Limit'),
            helper: i18n.__('Limit the amount of Outbound Connection %s will open', Settings.projectName),
            icon: 'settings_applications',
            action: {
                type: ACTION_TYPES.NUMBER,
            },
            advanced: true
        }, {
            id: 'streamPort',
            title: i18n.__('Stream Port'),
            helper: i18n.__('Port to stream on, randomlly choosen if 0'),
            icon: 'settings_applications',
            action: {
                type: ACTION_TYPES.NUMBER,
            },
            advanced: true
        }, {
            id: 'overallRatio',
            title: i18n.__('Overall Ratio'),
            helper: i18n.__('Downloaded so far: %s', Common.fileSize(Settings.totalDownloaded)),
            icon: 'settings_applications',
            advanced: true,
            action: {
                title: (Settings.totalUploaded / Settings.totalDownloaded).toFixed(2),
                type: ACTION_TYPES.LABEL,
            }

        }, {
            id: 'cache-directory',
            title: i18n.__('%s Directory', 'Cache'),
            helper: i18n.__('Open the Directory where %s keeps it\'s %s', Settings.projectName, 'Cache'),
            icon: 'folder',
            advanced: true,
            action: {
                type: ACTION_TYPES.BUTTON,
                title: i18n.__('Open'),
            }
        }, {
            id: 'deleteTmpOnClose',
            title: i18n.__('Clear %s', 'Cache'),
            helper: i18n.__('Delete temp folder after closing the App'),
            icon: 'delete',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'db-directory',
            title: i18n.__('%s Directory', 'Database'),
            helper: i18n.__('Open the Directory where %s keeps it\'s %s', Settings.projectName, 'Database'),
            icon: 'folder',
            advanced: true,
            action: {
                type: ACTION_TYPES.BUTTON,
                title: i18n.__('Open'),
            }
        }, {
            id: 'db-import',
            title: i18n.__('Import %s', 'Database'),
            helper: i18n.__('Upload a %s for %s to use', 'Database', Settings.projectName),
            icon: 'file_download',
            advanced: true,
            action: {
                type: ACTION_TYPES.BUTTON,
                title: i18n.__('Import'),
            }
        }, {
            id: 'db-export',
            title: i18n.__('Export %s', 'Database'),
            helper: i18n.__('export the %s, %s is currently using', 'Database', Settings.projectName),
            icon: 'file_upload',
            advanced: true,
            action: {
                type: ACTION_TYPES.BUTTON,
                title: i18n.__('Export'),
            }
        }, {
            id: 'db-export',
            title: i18n.__('Export %s', 'Database'),
            helper: i18n.__('export the %s, %s is currently using', 'Database', Settings.projectName),
            icon: 'file_upload',
            advanced: true,
            action: {
                type: ACTION_TYPES.BUTTON,
                title: i18n.__('Export'),
            }
        }, {
            id: 'tv_detail_jump_to',
            title: i18n.__('TV Detail Default'),
            helper: i18n.__('When Opening TV Detail jump to'),
            icon: 'exit_to_app',
            advanced: true,
            action: {
                type: ACTION_TYPES.DROPDOWN,
                options: {
                    firstUnwatched: 'First Unwatched Episode',
                    next: 'Next Episode In Series'
                },
            }
        }, {
            id: 'automaticUpdating',
            title: i18n.__('Update %s', Settings.projectName),
            helper: i18n.__('Automatically fetch and apply updates'),
            icon: 'update',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'events',
            title: i18n.__('Celebrate'),
            helper: i18n.__('Show icons celebrating various events'),
            icon: 'cake',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'minimizeToTray',
            title: i18n.__('Minimize to Tray'),
            helper: i18n.__('Show an icon to minimize in the top bar'),
            icon: 'settings_applications',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'bigPicture',
            title: i18n.__('Big Pictures'),
            helper: i18n.__('Show all pictures a tad bigger'),
            icon: 'aspect_ratio',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }]
    };

    var InterfaceSettings = {
        id: 'interface',
        title: i18n.__('Interface'),
        items: [{
            id: 'language',
            title: i18n.__('Default Language'),
            helper: i18n.__('Display the interface and metadata in this language (if available)'),
            icon: 'language',
            action: {
                type: ACTION_TYPES.DROPDOWN,
                options: Object.keys(App.Localization.langcodes)
                    .filter(key => (App.Localization.langcodes[key]))
                    .reduce((a, key) => {
                        a[key] = App.Localization.langcodes[key].nativeName;
                        return a;
                    }, {})
            }
        }, {
            id: 'theme',
            title: i18n.__('Theme'),
            helper: i18n.__('Select a different Look&Feel for the App'),
            icon: 'format_paint',
            action: {
                type: ACTION_TYPES.DROPDOWN,
                selected: App.Themes.indexOf(Settings.theme),
                options: App.Themes,
                apply: (value) => {
                    document.documentElement.className = App.Themes[value];
                    App.vent.trigger('updatePostersSizeStylesheet');
                    Settings.theme =  App.Themes[value];
                }
            }
        }, {
            id: 'watchedCovers',
            title: i18n.__('Watched Items'),
            helper: i18n.__('Select how to display %s', 'Watched Items'),
            icon: 'visibility',
            action: {
                type: ACTION_TYPES.DROPDOWN,
                options: {
                    none: 'Show',
                    fade: 'Fade',
                    hide: 'Hide'
                }
            }
        }, {
            id: 'start_screen',
            title: i18n.__('Start Screen'),
            helper: i18n.__('Select the view the App should start on'),
            icon: 'home',
            advanced: true,
            action: {
                type: ACTION_TYPES.DROPDOWN,
                options: arrayToi18nHash(['Movies','TV Series','Anime','Indie','Favorites', 'Watchlist', 'Last Open']),
            }

        }, {
            id: 'translateSynopsis',
            title: i18n.__('Translate Synopsis'),
            helper: i18n.__('Should we try to translate sysopsises'),
            icon: 'translate',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'coversShowRating',
            title: i18n.__('Show Rating'),
            helper: i18n.__('Display Rating info on top of Covers'),
            icon: 'star_rate',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'alwaysOnTop',
            title: i18n.__('Always On Top'),
            helper: i18n.__('Keep App above other'),
            icon: 'settings_applications',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }, {
            id: 'rememberFilters',
            title: i18n.__('Remember Filters'),
            helper: i18n.__('Restore your filters on App restart'),
            icon: 'sort',
            action: {
                type: ACTION_TYPES.SWITCH
            },
            advanced: true
        }
        ]
    };

    var SubtitlesSettings = {
        id: 'subtitles',
        title: i18n.__('Subtitles'),
        items: [{
            id: 'subtitle_language',
            title: i18n.__('Default Subtitle'),
            helper: i18n.__('Auto-Select this subtitle language by default if available'),
            icon: 'subtitles',
            action: {
                type: ACTION_TYPES.DROPDOWN,
                options: Object.keys(App.Localization.langcodes)
                    .filter(key => (
                        App.Localization.langcodes[key].subtitle !== undefined &&
                            App.Localization.langcodes[key].subtitle === true))
                    .reduce((a, key) => {
                        a[key] = App.Localization.langcodes[key].nativeName;
                        return a;
                    }, {})
            }
        }, {
            id: 'subtitle_size',
            title: i18n.__('Size'),
            helper: i18n.__('Select the default Font Size for %s', 'Subtitles'),
            icon: 'format_size',
            action: {
                type: ACTION_TYPES.DROPDOWN,
                options: ['20px','22px','24px','26px','28px','30px','32px','34px','36px','38px','40px','42px','44px','46px','48px','50px','52px','54px','56px','58px','60px']
            }
        }, {
            id: 'subtitle_font',
            title: i18n.__('Font'),
            helper: i18n.__('Select the default Font for %s', 'Subtitles'),
            icon: 'format_shapes',
            advanced: true,
            action: {
                type: ACTION_TYPES.DROPDOWN,
                options: App.Localization.subFonts,
            }
        }, {
            id: 'subtitle_decoration',
            title: i18n.__('Decoration'),
            helper: i18n.__('%s text decorations', 'Subtitles'),
            icon: 'format_color_text',
            advanced: true,
            action: {
                type: ACTION_TYPES.DROPDOWN,
                options: arrayToi18nHash(['None', 'Outline', 'Opaque Background', 'See-through Background']),
            }
        }, {
            id: 'subtitle_color',
            title: i18n.__('Color'),
            helper: i18n.__('%s text color', 'Subtitles'),
            icon: 'color_lens',
            advanced: true,
            action: {
                type: ACTION_TYPES.COLOR,
                options: [
                    '#ffffff',
                    '#ffff00',
                    '#ff0000',
                    '#ff00ff',
                    '#00ffff',
                    '#00ff00',
                ],
            }
        }, {
            id: 'subtitle_bold',
            title: i18n.__('Bold'),
            helper: i18n.__('Display %s using Bold Font', 'Subtitles'),
            icon: 'format_bold',
            advanced: true,
            action: {
                type: ACTION_TYPES.SWITCH
            },
        }]
    };

    var ExtensionsSettings = {
        id: 'extensions',
        title: i18n.__('Extensions'),
        sections: [{
            id: 'remote-control',
            title: i18n.__('Remote Control'),
            advanced: true,
            items: [{
                id: 'settingsIpAddress',
                title: i18n.__('IP Address'),
                helper: i18n.__('Set this machine\'s IP Address'),
                icon: 'location_on',
                action: {
                    type: ACTION_TYPES.TEXT,
                }
            }, {
                id: 'httpApiPort',
                title: i18n.__('%s Port', 'HTTP API'),
                helper: i18n.__('Port to use for %s', 'HTTP API'),
                icon: 'http',
                action: {
                    type: ACTION_TYPES.NUMBER,
                }
            }, {
                id: 'httpApiUsername',
                title: i18n.__('%s Username', 'HTTP API'),
                helper: i18n.__('Username To use for %s', 'HTTP API'),
                icon: 'account_box',
                action: {
                    type: ACTION_TYPES.TEXT,
                }
            }, {
                id: 'httpApiUsername',
                title: i18n.__('%s Username', 'HTTP API'),
                helper: i18n.__('Username To use for %s', 'HTTP API'),
                icon: 'account_box',
                action: {
                    type: ACTION_TYPES.PASSWORD,
                }
            }, {
                id: 'qrCodeGen',
                title: i18n.__('QR Code'),
                helper: i18n.__('Generate Pairing QR Code'),
                icon: 'lock',
                action: {
                    type: ACTION_TYPES.BUTTON,
                    title: i18n.__('Get Code')
                }
            }]
        }, {
            id: 'trakt-connected',
            title: 'Trakt.tv',
            showIf: (() => (App.Trakt.authenticated)),
            items: [{
                id: 'trakt-connected',
                title: i18n.__('You are currently connected to %s', 'Trakt.tv'),
                helper: i18n.__('%s connection state', 'Trakt.tv'),
                icon: 'verified_user',
                action: {
                    type: ACTION_TYPES.BUTTON,
                    title: 'Disconnect Account'
                }
            }, {
                id: 'traktSyncOnStart',
                title: i18n.__('Sync on Start'),
                helper: i18n.__('Automatically sync %s on App Start', 'Trakt.tv'),
                icon: 'settings_applications',
                action: {
                    type: ACTION_TYPES.SWITCH
                },
            }, {
                id: 'traktPlayback',
                title: i18n.__('Resume Playback'),
                helper: i18n.__('Restart your %s tracked media from where you left them', 'Trakt.tv'),
                icon: 'settings_applications',
                action: {
                    type: ACTION_TYPES.SWITCH
                },
            }, {
                id: 'traktSync',
                title: i18n.__('Sync with %s', 'Trakt.tv'),
                helper: i18n.__('%s sync master switch', 'Trakt.tv'),
                icon: 'sync',
                action: {
                    type: ACTION_TYPES.SWITCH
                },
            }]
        }, {
            id: 'trakt-not-connected',
            title: 'Trakt.tv',
            showIf: (() => (! App.Trakt.authenticated)),
            items: [{
                id: 'traktConnectTo',
                title: i18n.__('Connect to %s', 'Trakt.tv'),
                helper: i18n.__('Use OAuth to authenticate'),
                icon: 'insert_link',
                action: {
                    type: ACTION_TYPES.BUTTON,
                    title: 'Connect'
                }
            }]
        }, {
            id: 'tvshowtime-connected',
            title: 'TVShow Time',
            showIf: (() => (App.TVShowTime.authenticated)),
            items: [{
                id: 'tvshowtime-connected',
                title: i18n.__('You are currently connected to %s', 'TVShow Time'),
                helper: i18n.__('%s connection state', 'TVShow Time'),
                icon: 'verified_user',
                action: {
                    type: ACTION_TYPES.BUTTON,
                    title: 'Disconnect Account'
                }
            }]
        }, {
            id: 'tvshowtime-not-connected',
            title: 'TVShow Time',
            showIf: (() => (! App.TVShowTime.authenticated)),
            items: [{
                id: 'tvshowtime-connect',
                title: i18n.__('Connect to %s', 'TVShow Time'),
                helper: i18n.__('Use OAuth to authenticate'),
                icon: 'insert_link',
                action: {
                    type: ACTION_TYPES.BUTTON,
                    title: 'Connect'
                }
            }]
        }, {
            id: 'opensubtitles-connected',
            title: 'Open Subtitles',
            showIf: (() => (Settings.opensubtitlesAuthenticated)),
            items: [{
                id: 'opensubtitles-connected',
                title: i18n.__('You are currently connected to %s', 'OpenSubtitles'),
                helper: i18n.__('%s connection state', 'OpenSubtitles'),
                icon: 'verified_user',
                action: {
                    type: ACTION_TYPES.BUTTON,
                    title: 'Disconnect Account'
                }
            }, {
                id: 'opensubtitlesAutoUpload',
                title: i18n.__('Subtitle Upload'),
                helper: i18n.__('Automatically upload user-selected subtitles to %s', 'OpenSubtitles'),
                icon: 'verified_user',
                action: {
                    type: ACTION_TYPES.BUTTON,
                    title: 'Disconnect Account'
                }
            }]
        }, {
            id: 'opensubtitles-not-connected',
            title: 'TVShow Time',
            showIf: (() => (! Settings.opensubtitlesAuthenticated)),
            items: [{
                id: 'opensubtitles-username',
                title: i18n.__('%s Username', 'OpenSubtitles'),
                helper: i18n.__('Username you use to connect to %s', 'OpenSubtitles'),
                icon: 'account_box',
                action: {
                    type: ACTION_TYPES.TEXT,
                }
            }, {
                id: 'opensubtitles-password',
                title: i18n.__('%s Password', 'OpenSubtitles'),
                helper: i18n.__('Password you use to connect to %s', 'OpenSubtitles'),
                icon: 'lock',
                action: {
                    type: ACTION_TYPES.PASSWORD,
                }
            }, {
                id: 'opensubtitles-connect',
                title: i18n.__('Connect to %s', 'OpenSubtitles'),
                helper: i18n.__('%s stores an encrypted hash of your password in your local database', Settings.projectName),
                icon: 'link',
                action: {
                    type: ACTION_TYPES.BUTTON,
                    title: 'Connect'
                }
            }]
        }]
    };

    App.Model.Settings.Tabs = [
        GeneralSettings,
        InterfaceSettings,
        SubtitlesSettings,
        ExtensionsSettings
    ];

    App.Model.Settings.HeaderCollection = new App.Model.Settings.ItemCollection([{
        id: 'showAdvancedsettings',
        title: i18n.__('Show Advanced Settings'),
        icon: 'filter_list',
        type: ACTION_TYPES.SWITCH,
        apply: (value) => {
            const el = $('.settings-container');
            value?el.addClass('show-advanced'):el.removeClass('show-advanced');
        }
    }]);
})(window.App);
