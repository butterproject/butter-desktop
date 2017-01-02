(function (App) {
    'use strict';

    /** FIXME 
     * - remove filterbar shortcuts from here! we handle list>items, nothing else.
     * - onMoviesWatched should be in movie_detail.js 
     **/

    var SCROLL_MORE = 0.7; // 70% of window height
    var NUM_ITEMS_IN_ROW = 7;

    var ErrorView = Backbone.Marionette.ItemView.extend({
        template: '#movie-error-tpl',
        ui: {
            retryButton: '.retry-button',
            onlineSearch: '.online-search'
        },
        onBeforeRender: function () {
            this.model.set('error', this.error);
        },
        onRender: function () {
            if (this.retry) {
                this.ui.onlineSearch.css('visibility', 'visible');
                this.ui.retryButton.css('visibility', 'visible');
            }
        }
    });

    var List = Backbone.Marionette.CompositeView.extend({
        template: '#list-tpl',

        tagName: 'ul',
        className: 'list',

        childView: App.View.Item,
        childViewContainer: '.items',

        events: {
            'scroll': 'onScroll',
            'mousewheel': 'onScroll',
            'keydown': 'onScroll'
        },

        ui: {
            spinner: '.spinner'
        },

        isEmpty: function () {
            return !this.collection.length && this.collection.state !== 'loading';
        },

        hasError: function () {
            return this.collection.state === 'error';
        },

        getEmptyView: function () {
            var view = {};

            if (this.hasError()) {
                switch(App.currentview) {
                    case 'favorites':
                        view.error = i18n.__('Error, database is probably corrupted. Try flushing the bookmarks in settings.');
                        break;
                    case 'watchlist':
                        view.error = i18n.__('This feature only works if you have your TraktTv account synced. Please go to Settings and enter your credentials.');
                        break;
                    default:
                        view.error = i18n.__('The remote ' + App.currentview + ' API failed to respond, please check %s and try again later', '<a class="links" href="' + Settings.statusUrl + '">' + Settings.statusUrl + '</a>');
                        view.retry = true;
                }
            } else if (this.isEmpty()) {
                view.error = i18n.__('No ' + App.currentview + ' found...');
                view.retry = true;
            }

            return view.error ? ErrorView.extend(view) : false;
        },

        initialize: function () {
            this.listenTo(this.collection, 'loading', this.onLoading);
            this.listenTo(this.collection, 'loaded', this.onLoaded);
            this.listenTo(this.collection, 'error', this.onError);

            App.vent.on('shortcuts:list', this.initKeyboardShortcuts.bind(this));
            this.initKeyboardShortcuts();
            this.initPosterResizeKeys();
        },

        initKeyboardShortcuts: function () {
            Mousetrap.bind('up', this.moveUp.bind(this));
            Mousetrap.bind('down', this.moveDown.bind(this));
            Mousetrap.bind('left', this.moveLeft.bind(this));
            Mousetrap.bind('right', this.moveRight.bind(this));
            Mousetrap.bind('f', this.toggleSelectedFavourite.bind(this));
            Mousetrap.bind('w', this.toggleSelectedWatched.bind(this));
            Mousetrap.bind(['enter', 'space'], this.selectItem.bind(this));
            Mousetrap.bind(['ctrl+f', 'command+f'], this.focusSearch.bind(this));//FIXME: needs to be moved elsewhere
            Mousetrap(document.querySelector('input')).bind(['ctrl+f', 'command+f', 'esc'], this.blurSearch.bind(this));//FIXME: needs to be moved elsewhere
            Mousetrap.bind(['tab', 'shift+tab'], this.switchTab.bind(this));//FIXME: needs to be moved elsewhere
            Mousetrap.bind(['`', 'b'], this.openFavorites.bind(this));//FIXME: needs to be moved elsewhere
            Mousetrap.bind('i', this.showAbout.bind(this));//FIXME: needs to be moved elsewhere

            // register as many ctrl+number shortcuts as there are tabs
            Mousetrap.bind((() => {
                var shortcuts = [];
                for (let i = 1; i <= App.Config.getTabTypes().length; i++) {
                    shortcuts.push('ctrl+' + i);
                }
                return shortcuts;
            })(), this.switchSpecificTab.bind(this));//FIXME: needs to be moved elsewhere
        },

        //FIXME: needs to be moved elsewhere
        blurSearch: function (e, combo) {
            $('.search input').click().blur();
        },

        //FIXME: needs to be moved elsewhere
        isPlayerDestroyed: function () {
            return (App.PlayerView === undefined || App.PlayerView.isDestroyed) 
                && $('#about-container').children().length <= 0 
                && $('#player').children().length <= 0;
        },

        //FIXME: needs to be moved elsewhere
        selectTab: function (direction, currentTab) {
            var tabs = App.Config.getTabTypes();
            var i = currentTab ? tabs.indexOf(currentTab) : -1;
            var nextTab = tabs[(tabs.length + i + direction) % tabs.length];

            App.vent.trigger('about:close');
            App.vent.trigger('torrentCollection:close');
            App.vent.trigger('show:tab', nextTab);
        },

        //FIXME: needs to be moved elsewhere
        switchTab: function (e, combo) {
            if (this.isPlayerDestroyed()) {
                if (combo === 'tab') {
                    this.selectTab(+1, App.currentview);
                } else if (combo === 'shift+tab') {
                    this.selectTab(-1, App.currentview);
                }
            }
        },

        //FIXME: needs to be moved elsewhere
        switchSpecificTab: function (e, combo) {
            if (this.isPlayerDestroyed()) {
                this.selectTab(combo.substr(-1));
            }
        },

        //FIXME: needs to be moved elsewhere
        openFavorites: function () {
            if (this.isPlayerDestroyed()) {
                $('.favorites').click();
            }
        },

        //FIXME: needs to be moved elsewhere
        showAbout: function () {
            if (this.isPlayerDestroyed()) {
                $('.about').click();
            }
        },

        initPosterResizeKeys: function () {
            var $el = $(document);

            $el.on('mousewheel', (e) => {
                if (this.isPlayerDestroyed() && (e.ctrlKey || e.metaKey)) {
                    e.stopPropagation();
                    return this.posterResize(e.originalEvent.wheelDelta);
                }
            });

            $el.on('keydown', (e) => {
                if (this.isPlayerDestroyed() && (e.ctrlKey || e.metaKey)) {
                    if (e.key === '+') {
                        this.posterResize(1);
                    } else if (e.key === '-') {
                        this.posterResize(-1);
                    }
                }
            });
        },

        onShow: function () {
            if (this.collection.state === 'loading') {
                this.onLoading();
            }
        },
        allLoaded: function () {
            return this.collection.providers.torrents
                .reduce((a, c) => (
                    a && c.loaded
                ), true);
        },
        onLoading: function () {
            var loadmore = $(document.getElementById('load-more-item'));
            loadmore.children('.status-loadmore').css('display', 'none');
            loadmore.children('.loading-container').css('display', 'block');
        },

        onLoaded: function () {
            App.vent.trigger('list:loaded');

            this.ui.spinner.css('display', 'none');
            this.completerow();

            if (this.allLoaded()) {
                var loadmore = $(document.getElementById('load-more-item'));
                loadmore.children('.status-loadmore').css('display', 'block');
                loadmore.children('.loading-container').css('display', 'none');
            }

        },

        onError: function () {
            // XXX trigger a render so getEmptyView() is called
            this.render();

            App.vent.trigger('list:loaded');

            this.ui.spinner.css('display', 'none');
            this.completerow();
        },

        checkFetchMore: function () {
            var loadmore = $(document.getElementById('load-more-item'));

            return ( // if load more is visible onLoaded, fetch more results
                loadmore.is(':visible') 
                && Common.isElementInViewport(loadmore)
            ) ? this.collection.fetchMore() : false;
        },

        itemsPerRow: function () {
            var total = 0;
            var items = $(document.querySelector('.items')).children('.item');

            for (var i = 0; i < items.length; i++) {
                var el = $(items[i]);

                if (el.prev().length > 0 && el.position().top !== el.prev().position().top) {
                    break;
                }
                
                total++; 
            }

            return total;
        },

        completerow: function () {
            NUM_ITEMS_IN_ROW = this.itemsPerRow();

            var items = $(document.querySelector('.items'));

            var loadmore = 
                '<div id="load-more-item" class="load-more">' +
                    '<span class="status-loadmore">' + 
                        i18n.__('Load More') + 
                    '</span>' +
                    '<div class="loading-container">' +
                        '<div class="sk-folding-cube">' +
                              '<div class="sk-cube1 sk-cube"></div>' +
                              '<div class="sk-cube2 sk-cube"></div>' +
                              '<div class="sk-cube4 sk-cube"></div>' +
                              '<div class="sk-cube3 sk-cube"></div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            var ghosts = '<div class="ghost"></div>'.repeat(10);

            items.children('#load-more-item').remove();
            items.children('.ghost').remove();

            items.append(loadmore + ghosts);

            this.showloadmore();
        },

        showloadmore: function () {
            if (
                App.Config.getTabTypes().indexOf(App.currentview) !== -1
                && this.collection.hasMore
                && !this.collection.filter.keywords
                && this.collection.state !== 'error'
                && this.collection.length
            ) {
                var loadmore = $(document.getElementById('load-more-item'));
                loadmore.css('display', 'inline-block').click(_ => {
                    // FIXME: this doesnt seem to ever be available, it's either loading automatically or loadmore is hidden. I'd recommend removing the button alltogether, leaving only the spinner (maybe clickable if needed)
                    loadmore.off('click');
                    this.collection.fetchMore();
                });
            }
        },

        onScroll: function () {
            if (!this.collection.hasMore) {
                return;
            }

            var totalHeight = this.$el.prop('scrollHeight');
            var currentPosition = this.$el.scrollTop() + this.$el.height();

            if (this.collection.state === 'loaded' && (currentPosition / totalHeight) > SCROLL_MORE) {
                this.collection.fetchMore();
            }
        },

        //FIXME: needs to be moved elsewhere
        focusSearch: function (e) {
            $('.search input').click();
        },

        posterResize: function (delta) {
            var jump = delta > 0 ? +1 : -1;

            var currentSize = Settings.postersWidth;
            var currentIndex = Settings.postersJump.indexOf(currentSize);

            var nextIndex = (currentIndex + jump) > 0 ? currentIndex + jump : 0;
            var nextSize = Settings.postersJump[nextIndex];

            if (currentIndex !== nextIndex && nextSize) {
                App.db.writeSetting({
                    key: 'postersWidth',
                    value: nextSize
                }).then(() => {
                    App.vent.trigger('updatePostersSizeStylesheet');
                    NUM_ITEMS_IN_ROW = this.itemsPerRow();
                });
            }
        },

        selectItem: function (e) {
            e.stopPropagation();

            $('.item.selected .cover').click();
        },

        selectIndex: function (index) {
            var item = $('.items .item');

            if (item.eq(index).length === 0 || item.eq(index).children().length === 0) {
                return;
            }

            var previous = $('.items .item.selected');
            previous.removeClass('selected');

            var next = item.eq(index);
            next.addClass('selected');
            if (!Common.isElementInViewport(next)) {
                next[0].scrollIntoView(false);
                this.onScroll();
            }
        },

        recalcRow: function () {
            // recalc items per row if win.width has changed
            if (win.width.toString() !== sessionStorage.listLastWidth) {
                sessionStorage.listLastWidth = win.width;
                NUM_ITEMS_IN_ROW = this.itemsPerRow();
            }

            return NUM_ITEMS_IN_ROW;
        },

        moveUp: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var index = $('.items .item.selected').index();
            if (index === -1) {
                index = 0;
            } else {
                index = index - this.recalcRow();
            }
            if (index < 0) {
                return;
            }
            this.selectIndex(index);
        },

        moveDown: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var index = $('.items .item.selected').index();
            if (index === -1) {
                index = 0;
            } else {
                index = index + this.recalcRow();
            }
            this.selectIndex(index);
        },

        moveLeft: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var index = $('.items .item.selected').index();
            if (index === -1) {
                index = 0;
            } else if (index === 0) {
                index = 0;
            } else {
                index = index - 1;
            }
            this.selectIndex(index);
        },

        moveRight: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var index = $('.items .item.selected').index();
            if (index === -1) {
                index = 0;
            } else {
                index = index + 1;
            }
            this.selectIndex(index);
        },

        toggleSelectedFavourite: function (e) {
            $('.item.selected .actions-favorites').click();
        },

        toggleSelectedWatched: function (e) {
            $('.item.selected .actions-watched').click();
        },
    });

    //FIXME: needs to be moved elsewhere
    function onMoviesWatched(movie, channel) {
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

    App.vent.on('movie:watched', onMoviesWatched);

    App.View.List = List;
})(window.App);
