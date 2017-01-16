(function(App) {
    'use strict';

    var loadImage = function (img, type, onLoad) {
        var cache = new Image();
        cache.src = img;

        cache.onload = function () {
            if (img.indexOf('.gif') !== -1) { // freeze gifs
                var c = document.createElement('canvas');
                var w  = c.width = img.width;
                var h = c.height = img.height;

                c.getContext('2d').drawImage(cache, 0, 0, w, h);
                img = c.toDataURL();
            }
            onLoad(img);
        };

        cache.onerror = () => {
            onLoad(null);
        };
    };

    App.View.ActionBar = Backbone.Marionette.ItemView.extend({
        template: '#action-bar-tpl',
        className: 'actions-bar',
        ui: {
            bookmarkIcon: '.favourites-toggle',
            watchedIcon: '.watched-toggle',
        },
        events: {
            'click .go-back': 'closeDetails',
            'mousedown .magnet-link': 'openMagnet',
        },

        closeDetails: function () {
            App.vent.trigger('movie:closeDetail');
        },

    });

    App.View.GenericDetail = App.View.Generic(Backbone.Marionette.LayoutView, {
        template: '#generic-detail-tpl',
        className: 'generic-detail',
        ui: {
            backdrop: '.backdrop',
        },
        initialize: function () {
            //If a child was removed from above this view
            this.bindAppEvent('viewstack:pop', function () {
                if (_.last(App.ViewStack) === this.className) {
                    Object.keys(this.keyboardShortCuts).map(k => (
                        Mousetrap.bind(k, this.keyboardShortCuts[k])
                    ));
                }
            });

            //If a child was added above this view
            this.bindAppEvent('viewstack:push', function () {
                if (_.last(App.ViewStack) !== this.className) {
                    Object.keys(this.keyboardShortCuts).map(Mousetrap.unbind);
                }
            });
        },

        onShow: function () {
            console.log('Show movie detail (' + this.model.get('imdb_id') + ')');

            App.MovieDetailView = this;

            this.loadImages();
            this.loadComponents();

            $('.spinner').hide();
        },

        loadComponents: function () {
            console.error('implement in subclasses');
        },

        loadImages: function () {
            var nobg = 'images/bg-header.jpg';
            var b = this.model.get('backdrop') || this.model.get('poster') || nobg;

            loadImage(b, 'backdrop', (img) => {
                this.ui.backdrop.css('background-image', 'url(' + (img || nobg) + ')')
                    .addClass('fadein');
            });
        },
    });


    App.View.DetailCard = App.View.Generic(Backbone.Marionette.LayoutView, {
        template: '#movie-detail-tpl',
        className: 'movie-detail',

        ui: {
            poster: '.mcover-image'
        },

        events: {
            'click .movie-imdb-link': 'openIMDb',
            'click .rating-container': 'switchRating'
        },

        regions: {
            PlayControl: '#play-control'
        },

        initialize: function () {
            this.bindAppEvent('shortcuts:movies', this.initKeyboardShortcuts);
            this.bindAppEvent('change:quality', this.renderHealth);
            this.bindAppEvent('movie:watched', this.onMoviesWatched);
        },

        onShow: function () {
            console.log('Show movie detail (' + this.model.get('imdb_id') + ')');

            App.MovieDetailView = this;

            this.hideUnused();
            this.loadImages();
            this.loadComponents();
            this.renderHealth();
            this.initKeyboardShortcuts();

            $('.spinner').hide();
        },

        loadComponents: function () {
            // play control
            this.showView(this.PlayControl, new App.View.PlayControl({
                model: this.model
            }));
        },

        loadImages: function () {
            var noimg = 'images/posterholder.png';
            var p = this.model.get('poster') || noimg;
            loadImage(p, 'poster', (img) => {
                this.ui.poster.attr('src', (img || noimg)).addClass('fadein');
            });
        },

        hideUnused: function () {
            var id = this.model.get('imdb_id');

            if (!this.model.get('torrents')) { // no torrents
                $('.magnet-link, .health-icon').hide();
            }

            if (!this.model.get('rating')) { // no ratings
                $('.rating-container').hide();
            }

            if (!id || (id && ['mal', 'ccc'].indexOf(id) === -1)) { // if anime
                $('.movie-imdb-link').hide();
            }
        },

        initKeyboardShortcuts: function () {
            this.bindShortCut(['esc', 'backspace'], this.closeDetails);
            this.bindShortCut(['enter', 'space'], () => {
                $('#watch-now').click();
            });
            this.bindShortCut('f', () => {
                $('.favourites-toggle').click();
            });
        },

        switchRating: function () {
            $('.number-container').toggleClass('hidden');
            $('.star-container').toggleClass('hidden');
            AdvSettings.set('ratingStars', $('.number-container').hasClass('hidden'));
        },

        renderHealth: function () {
            try {
                var torrent = this.model.get('torrents')[this.model.get('quality')];
                var health = torrent.health.capitalize();
                var ratio = torrent.peer > 0 ? torrent.seed / torrent.peer : +torrent.seed;

                $('.health-icon').tooltip({
                    html: true
                })
                                 .removeClass('Bad Medium Good Excellent')
                                 .addClass(health)
                                 .attr('data-original-title', i18n.__('Health ' + health) + ' - ' + i18n.__('Ratio:') + ' ' + ratio.toFixed(2) + ' <br> ' + i18n.__('Seeds:') + ' ' + torrent.seed + ' - ' + i18n.__('Peers:') + ' ' + torrent.peer)
                                 .tooltip('fixTitle');
            } catch(e) {
                console.error('Cannot render health', e); //FIXME
            }
        },

        openIMDb: function () {
            nw.Shell.openExternal('http://www.imdb.com/title/' + this.model.get('imdb_id'));
        },

        openMagnet: function (e) {
            var torrent = this.model.get('torrents')[this.model.get('quality')],
                magnetLink;

            if (torrent.magnet) { // Movies
                magnetLink = torrent.magnet;
            } else { // Anime
                magnetLink = torrent.url;
            }
            if (e.button === 2) { //if right click on magnet link
                var clipboard = nw.Clipboard.get();
                clipboard.set(magnetLink, 'text'); //copy link to clipboard
                $('.notification_alert').text(i18n.__('The magnet link was copied to the clipboard')).fadeIn('fast').delay(2500).fadeOut('fast');
            } else {
                nw.Shell.openExternal(magnetLink);
            }
        },

        onMoviesWatched: function (movie, channel) {
            if  (channel === 'database') {
                try {
                    // activated when movie was marked as seen in the player & movie details are open. It's really bad...
                    switch (Settings.watchedCovers) {
                        case 'fade':
                            $('li[data-imdb-id="' + App.MovieDetailView.model.get('imdb_id') + '"] .actions-watched').addClass('selected');
                            $('li[data-imdb-id="' + App.MovieDetailView.model.get('imdb_id') + '"]').addClass('watched');
                            break;
                        case 'hide':
                            $('li[data-imdb-id="' + App.MovieDetailView.model.get('imdb_id') + '"]').remove();
                            break;
                    }
                    $('.watched-toggle').addClass('selected').text(i18n.__('Seen'));
                    App.MovieDetailView.model.set('watched', true);
                } catch (e) {}
            }
        }
    });

})(window.App);
