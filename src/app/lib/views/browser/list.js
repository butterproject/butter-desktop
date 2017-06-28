(function (App) {
    'use strict';

    var SCROLL_MORE = 0.7; // 70% of window height
    var ITEM_MARGINS = 20; // css declaration

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
            Mousetrap.bind(['up', 'down', 'left', 'right'], this.move.bind(this));
            Mousetrap.bind('f', this.toggleSelectedFavourite.bind(this));
            Mousetrap.bind('w', this.toggleSelectedWatched.bind(this));
            Mousetrap.bind(['enter', 'space'], this.clickItem.bind(this));
        },

        initPosterResizeKeys: function () {
            var $el = $(document);

            $el.on('mousewheel', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    e.stopPropagation();
                    return this.posterResize(e.originalEvent.wheelDelta);
                }
            });

            $el.on('keydown', (e) => {
                if (e.ctrlKey || e.metaKey) {
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
            if (!this.collection
                || !this.collection.providers
                || !this.collection.providers.torrents) {
                return true;
            }
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

            this.selectFirstItem();
        },

        onError: function () {
            // XXX trigger a render so getEmptyView() is called
            this.render();
            this.ui.spinner.css('display', 'none');
        },

        checkFetchMore: function () {
            var loadmore = $(document.getElementById('load-more-item'));

            return ( // if load more is visible onLoaded, fetch more results
                loadmore.is(':visible') 
                && Common.isElementInViewport(loadmore)
            ) ? this.collection.fetchMore() : false;
        },

        itemsPerRow: function (max) {
            var currentWidth = this.$el.width();
            var itemWidth = Settings.postersWidth + ITEM_MARGINS;

            // minItemsPerRow or maxItemsPerRow
            return ~~(1 / (itemWidth / (max ? window.screen.width : currentWidth)));
        },

        completerow: function () {
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

            var ghosts = '<div class="ghost"></div>'.repeat(this.itemsPerRow(true));

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
                    this.completerow();
                });
            }
        },

        clickItem: function (e) {
            e.stopPropagation();

            $('.item.selected .cover').click();
        },

        selectFirstItem: function () {
            var firstItem = $('.items').find('.item:visible:first');
            this.selectItem(null, $(firstItem));
        },

        selectItem: function (prev, next) {
            prev && prev.removeClass('selected');
            next.addClass('selected');

            if (!Common.isElementInViewport(next)) {
                next[0].scrollIntoView(false);
                this.onScroll();
            }
        },

        move: function (e) {
            e.preventDefault();
            e.stopPropagation();

            var row = this.itemsPerRow();
            var items = this.$el.find('.item');

            var currentItem = this.$el.find('.item.selected');
            var currentIndex = currentItem.index();
            if (currentIndex === -1) { // jump to first
                return this.selectItem(currentItem, this.$el.find(items[0]));
            }

            var map = {
                ArrowDown: currentIndex + row,
                ArrowUp: currentIndex - row,
                ArrowRight: currentIndex + 1,
                ArrowLeft: currentIndex - 1
            };

            var nextIndex = Math.max(0, map[e.key]);
            if (nextIndex >= items.length) { // jump to last
                nextIndex = items.length - 1;
            }
            var nextItem = items.eq(nextIndex);            

            this.selectItem(currentItem, nextItem);
        },

        toggleSelectedFavourite: function (e) {
            $('.item.selected .actions-favorites').click();
        },

        toggleSelectedWatched: function (e) {
            $('.item.selected .actions-watched').click();
        },
    });

    App.View.List = List;
})(window.App);