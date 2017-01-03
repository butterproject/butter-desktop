(function (App){
    'use strict';

    var Provider = require('butter-provider');

    App.View.PlayControl = Backbone.Marionette.LayoutView.extend({
        template: '#play-control-tpl',
        ui: {
            bookmarkIcon: '.favourites-toggle',
            watchedIcon: '.watched-toggle'
        },
        events: {
            'click #watch-now': 'startStreaming',
            'click #watch-trailer': 'playTrailer',
            'click .favourites-toggle': 'toggleFavourite',
            'click .playerchoicemenu li a': 'selectPlayer',
            'click .watched-toggle': 'toggleWatched',
        },
        regions: {
            subDropdown: '#subs-dropdown',
            audioDropdown: '#audio-dropdown',
            qualityDropdown: '#quality-dropdown',
            playerDropdown: '#player-dropdown'
        },

        initialize: function () {
            this.views = {};

            if (! this.model.get('langs')) {
               this.model.set('langs', {en: undefined});
            }

            App.vent.on('sub:lang', this.setSubtitle.bind(this));
            App.vent.on('update:subtitles', function (subs)  {
                this.views.sub.update(subs);
            }.bind(this));

            App.vent.on('audio:lang',       this.setAudio.bind(this));
            App.vent.on('selector:quality', this.setQuality.bind(this));
            App.vent.on('selector:player', App.Device.Collection.setDevice.bind(App.Device.Collection));

            this.model.on('change:quality', function () {
                App.vent.trigger('change:quality', this.model.get('quality'));
            }.bind(this));
        },

        onShow: function () {
            this.hideUnused();
            this.setQuality();
            this.loadComponents();
            this.setUiStates();
            this.initKeyboardShortcuts();

            this.model.on('change:langs',    this.loadAudioDropdown.bind(this));
            this.model.on('change:subtitle', this.loadSubDropdown.bind(this));
            this.model.on('change:quality',  this.loadQualityDropdown.bind(this));

            App.vent.on('device:selected',   this.loadPlayerDropdown.bind(this));
            App.vent.on('device:add',        this.loadPlayerDropdown.bind(this));
        },

        onDestroy: function () {
            App.vent.off('sub:lang');
            App.vent.off('audio:lang');
            App.vent.off('update:subtitles');
            App.vent.off('selector:quality');
            App.vent.off('selector:player');
            this.model.off('change:quality');
            Object.values(this.views).forEach(v => v.destroy());
        },

        initKeyboardShortcuts: function () {
            Mousetrap.bind('q', this.toggleQuality); //XXX
        },

        getBestQuality: function (torrents) {
            var providerQualities = Object.values(Provider.QualityType)
                                          .map(q => (Number(q)));

            // returns the best matching quality we can find
            return [Settings.movies_default_quality] // first the one we saved
                .concat(providerQualities)           // then any valid Provider.QualityType
                .concat(Object.keys(torrents))       // then anything.
                .reduce((a, c) => (torrents[a] ? a : c));
        },

        setQuality: function (quality) {
            var torrents = this.model.get('torrents');
            if (! quality) {
                quality = this.getBestQuality(torrents);
            }

            this.model.set('quality', quality);
            AdvSettings.set('movies_default_quality', quality);
        },

        hideUnused: function() {
            if (!this.model.get('torrents')) { // no torrents
                $('#player-chooser, #audio-dropdown, #subs-dropdown').hide();
            }

            if (!this.model.get('trailer')) {
                $('#watch-trailer').hide();
            }
        },

        _loadDropdown: function (type, view, model) {
            this.views[type] && this.views[type].destroy();
            this.views[type] = new view({
                model: model
            });
            this[`${type}Dropdown`].show (this.views[type]);
        },

        loadDropdown: function (type, view, attrs) {
            return this._loadDropdown(type, view,
                                      new App.Model.Lang(Object.assign({type:type}, attrs)));
        },

        loadAudioDropdown: function () {
            return this.loadDropdown('audio', App.View.LangDropdown, {
                title: i18n.__('Audio Language'),
                selected: this.model.get('defaultAudio'),
                values: this.model.get('langs')
            });
        },

        loadSubDropdown: function () {
            return this.loadDropdown('sub', App.View.LangDropdown, {
                title: i18n.__('Subtitle'),
                selected: this.model.get('defaultSubtitle'),
                hasNull: true,
                values: this.model.get('subtitle')
            });
        },

        loadQualityDropdown: function () {
            var values = this.model.get('torrents');
            return this.loadDropdown('quality', App.View.SelectorDropdown, {
                title: i18n.__('Quality'),
                selected: Object.keys(values)[0], // XXX be smarter
                values: values,
                icon: 'high_quality'
            });
        },

        loadPlayerDropdown: function () {
            var values = App.Device.Collection.models
                .reduce((a, c) => {
                    a[c.id] = c;
                    return a;
                }, {});

            return this.loadDropdown('player', App.View.SelectorDropdown, {
                title: i18n.__('Player'),
                selected: App.Device.Collection.selected.get('id'),
                values: values,
                icon: 'airplay'
            });
        },

        loadComponents: function() {
            this.loadAudioDropdown();
            this.loadSubDropdown();
            this.loadQualityDropdown();
            this.loadPlayerDropdown();

            // player chooser
            App.Device.ChooserView('#player-chooser').render();
        },

        setUiStates: function () {
            $('.star-container,.movie-imdb-link,.q720,input,.magnet-link').tooltip({
                html: true
            });

            // Bookmarked / not bookmarked
            if (this.model.get('bookmarked')) {
                this.ui.bookmarkIcon.addClass('selected');
            }

            // Seen / Unseen
            if (this.model.get('watched')) {
                this.ui.watchedIcon.addClass('selected');
            }
            // display stars or number
            if (!Settings.ratingStars) {
                $('.star-container').addClass('hidden');
                $('.number-container').removeClass('hidden');
            }

            // switch to default subtitle
            this.setSubtitle(Settings.subtitle_language);

            this.setTooltips();
        },

        setTooltips: function () {
            // watched state
            var watched = this.model.get('watched');
            var textWatched = watched ? 'Seen' : 'Not Seen';
            var textWatchedHover = watched ? 'Mark as unseen' : 'Mark as Seen';
            this.ui.watchedIcon.text(i18n.__(textWatched));

            this.ui.watchedIcon.hover(function () {
                this.ui.watchedIcon.text(i18n.__(textWatchedHover));
            }.bind(this), function () {
                this.ui.watchedIcon.text(i18n.__(textWatched));
            }.bind(this));

            // favorite state
            var bookmarked = this.model.get('bookmarked');
            var textBookmarked = bookmarked ? 'Remove from bookmarks' : 'Add to bookmarks';
            this.ui.bookmarkIcon.text(i18n.__(textBookmarked));
        },

        setSubtitle: function (lang) {
            var subtitles = this.model.get('subtitle');

            if (subtitles === undefined || subtitles[lang] === undefined) {
                lang = 'none';
            }

            this.subtitle_selected = lang;
            console.info('Subtitles: ' + this.subtitle_selected);
        },

        setAudio: function (lang) {
            var audios = this.model.get('langs');

            if (audios === undefined || audios[lang] === undefined) {
                lang = 'none';
            }

            this.audio_selected = lang;

            console.info('Audios: ' + lang);
        },

        startStreaming: function () {
            var providers = this.model.get('providers');
            var quality = this.model.get('quality');
            var defaultTorrent = this.model.get('torrents')[quality];

            var filters =  {
                quality: quality,
                lang: this.audio_selected
            };

            var torrent = providers.torrent
                .resolveStream(defaultTorrent, filters, this.model.attributes);

            var torrentStart = new Backbone.Model({
                imdb_id: this.model.get('imdb_id'),
                torrent: torrent,
                backdrop: this.model.get('backdrop'),
                subtitle: this.model.get('subtitle'),
                defaultSubtitle: this.subtitle_selected,
                title: this.model.get('title'),
                quality: quality,
                lang: this.audio_selected,
                type: 'movie',
                device: App.Device.Collection.selected,
                cover: this.model.get('cover')
            });
            App.vent.trigger('stream:start', torrentStart);
        },

        playTrailer: function () {

            var trailer = new Backbone.Model({
                src: this.model.get('trailer'),
                type: 'video/youtube',
                subtitle: null,
                quality: false,
                title: this.model.get('title')
            });
            var tmpPlayer = App.Device.Collection.selected.attributes.id;
            App.Device.Collection.setDevice('local');
            App.vent.trigger('stream:ready', trailer);
            App.Device.Collection.setDevice(tmpPlayer);
        },

        toggleFavourite: function (e) {
            $('li[data-imdb-id="' + this.model.get('imdb_id') + '"] .actions-favorites').click();
            this.ui.bookmarkIcon.toggleClass('selected');
            this.model.set('bookmarked', !this.model.get('bookmarked'));
            this.setTooltips();
        },

        toggleWatched: function (e) {
            $('li[data-imdb-id="' + this.model.get('imdb_id') + '"] .actions-watched').click();
            this.ui.watchedIcon.toggleClass('selected');
            this.model.set('watched', !this.model.get('watched'));
            this.setTooltips();
        },

        selectPlayer: function (e) {
            var player = $(e.currentTarget).parent('li').attr('id').replace('player-', '');
            this.model.set('device', player);
            if (!player.match(/[0-9]+.[0-9]+.[0-9]+.[0-9]/ig)) {
                AdvSettings.set('chosenPlayer', player);
            }
        },
    });

})(window.App);


