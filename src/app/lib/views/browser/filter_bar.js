(function (App) {
    'use strict';

    var ButterProvider = require('butter-provider');

    App.View.FilterBar = Backbone.Marionette.LayoutView.extend({
        template: '#filter-bar-tpl',
        className: 'filter-bar',
        events: {
            'click #filterbar-settings': 'settings',
            'click #filterbar-about': 'about',
            'click #filterbar-random': 'randomMovie',
            'click .contentTab': 'tabClicked',
            'click .triggerUpdate': 'updateDB'
        },
        regions: {
            typesDropdown: '#types-dropdown',
            genresDropdown: '#genres-dropdown',
            sortersDropdown: '#sorters-dropdown',
            searchDropdown: '#search-dropdown'
        },
        initialize: function () {
            this.views = {};

            App.vent.on('filter:types', type => (this.model.set({
                keyword: '',
                type: type
            })));

            App.vent.on('filter:genres', genre => (this.model.set({
                keyword: '',
                genre: genre
            })));

            App.vent.on('filter:sorters', sorter => (this.model.set({
                keyword: '',
                sorter: sorter
            })));

            App.vent.on('selected:tab', this.setActive.bind(this));
        },
        onDestroy: function () {
            App.vent.off('filter:types');
            App.vent.off('filter:genres');
            App.vent.off('filter:sorters');

            // XXX(xaiki): not sure about this
            App.vent.off('selected:tab');
        },
        setActive: function (set) {
            if (Settings.startScreen === 'Last Open') {
                AdvSettings.set('lastTab', set);
            }

            $('.right .search').show();
            $('#filterbar-random').hide();
            $('.filter-bar').find('.active').removeClass('active');
            $(`[data-value="${set}"]`).addClass('active');
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

        loadFilterDropdown: function (filter, attrs) {
            var values = this.model.get(filter);
            values && Object.keys(values).length && this.loadDropdown(
                filter,
                App.View.FilterDropdown,
                Object.assign({
                    selected: Object.keys(values)[0],
                    values: values
                }, attrs));

        },
        loadComponents: function() {
            this.loadFilterDropdown('types', {
                title: i18n.__('Type')
            });

            this.loadFilterDropdown('genres', {
                title: i18n.__('Genre')
            });

            this.loadFilterDropdown('sorters', {
                title: i18n.__('Sort by')
            });

            this._loadDropdown('search', App.View.SearchDropdown, this.model);
        },
        onShow: function () {
            this.loadComponents();

            var activetab;

            if (AdvSettings.get('startScreen') === 'Last Open') {
                activetab = AdvSettings.get('lastTab');
            } else {
                activetab = AdvSettings.get('startScreen');
            }

            if (typeof App.currentview === 'undefined') {
                App.currentview = activetab;
                App.previousview = App.Config.getTabTypes()[0];
                this.setActive(App.currentview);
            }

            this.$('.tooltipped').tooltip({
                delay: {
                    'show': 800,
                    'hide': 100
                }
            });
            this.$('.providerinfo').tooltip({
                delay: {
                    'show': 50,
                    'hide': 50
                }
            });

            if (Settings.rememberFilters) {
                try {
                    this.fixFilter();
                } catch (e) {}
            }


        },
        settings: function (e) {
            App.vent.trigger('about:close');
            App.vent.trigger('settings:show');
        },

        about: function (e) {
            App.vent.trigger('about:show');
        },

        tabClicked: function (e) {
            e.preventDefault();
            var value = $(e.currentTarget).attr('data-value');
            return this.switchToTab.apply(this, [value]);
        },

        switchToTab: function (value) {
            App.vent.trigger('about:close');
            App.vent.trigger('torrentCollection:close');
            App.vent.trigger('show:tab', value);
        },

        updateDB: function (e) {
            e.preventDefault();
            App.vent.trigger(this.type + ':update', []);
        },

        randomMovie: function () {
            var that = this;
            $('.spinner').show();

            function randomArray(a) {
                return a[Math.floor(Math.random(a.length))];
            }

            var provider = randomArray(App.Providers.getByType(ButterProvider.TabType.MOVIE));
            provider.random()
                .then(function (data) {
                    if (App.watchedMovies.indexOf(data.imdb_code) !== -1) {
                        that.randomMovie();
                        return;
                    }
                    that.model.set({
                        isRandom: true,
                        keywords: data.imdb_code,
                        genre: ''
                    });
                    App.vent.trigger('movie:closeDetail');
                    App.vent.on('list:loaded', function () {
                        if (that.model.get('isRandom')) {
                            $('.main-browser .items .cover')[0].click();
                            that.model.set('isRandom', false);
                        }
                    });
                })
                .catch(function (err) {
                    $('.spinner').hide();
                    $('.notification_alert').text(i18n.__('Error loading data, try again later...')).fadeIn('fast').delay(2500).fadeOut('fast');
                });
        }

    });
})(window.App);
