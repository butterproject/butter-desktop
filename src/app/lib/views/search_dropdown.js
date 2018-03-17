(function (App){
    'use strict';

    App.View.SearchDropdown = App.View.Dropdown.extend({
        template: '#search-dropdown-tpl',

        ui: {
            selected: '.selected',
            items: '.search-item',
            searchForm: '.search form',
            searchInput: '.search input',
            search: '.search',
            searchClear: '.search .clear',
            searchIcon: '.search form i'
        },

        events: {
            'hover  @ui.searchInput': 'focus',
            'submit @ui.searchForm': 'search',
            'click @ui.searchIcon': 'search',
            'contextmenu @ui.searchInput': 'rightclick_search',
            'click  @ui.searchClear': 'clearSearch',
            'click  @ui.search': 'focusSearch'
        },

        onAttach: function () {
            this.initKeyboardShortcuts();
        },

        initKeyboardShortcuts: function () {
            Mousetrap.bind(['ctrl+f', 'command+f'], this.openSearch.bind(this));
            Mousetrap(this.ui.searchInput[0]).bind(['ctrl+f', 'command+f', 'esc'], this.exitSearch.bind(this));
        },

        focusSearch: function (e) {
            this.ui.searchInput.focus();
        },
        
        openSearch: function (e) {
            this.focusSearch();
            this.ui.search.addClass('open');
        },
        
        exitSearch: function (e) {
            this.ui.search.removeClass('open');
            this.ui.searchInput.blur();
        },

        focus: function (e) {
            e.focus();
        },

        rightclick_search: function (e) {
            e.preventDefault();
            this.openSearch();
            var search_menu = new this.context_Menu(i18n.__('Cut'), i18n.__('Copy'), i18n.__('Paste'));
            search_menu.popup(e.originalEvent.x, e.originalEvent.y);
        },

        context_Menu: function (cutLabel, copyLabel, pasteLabel) {
            var menu = new nw.Menu(),

                cut = new nw.MenuItem({
                    label: cutLabel || 'Cut',
                    click: function () {
                        document.execCommand('cut');
                    }
                }),

                copy = new nw.MenuItem({
                    label: copyLabel || 'Copy',
                    click: function () {
                        document.execCommand('copy');
                    }
                }),

                paste = new nw.MenuItem({
                    label: pasteLabel || 'Paste',
                    click: function () {
                        var clipboard = nw.Clipboard.get();
                        var text = clipboard.get('text');
                        $('.search input').val(text);
                    }
                });

            menu.append(cut);
            menu.append(copy);
            menu.append(paste);

            return menu;
        },

        search: function (e) {
            App.vent.trigger('about:close');
            App.vent.trigger('torrentCollection:close');
            App.vent.trigger('movie:closeDetail');
            e.preventDefault();
            var searchvalue = this.ui.searchInput.val();
            this.model.set({
                keywords: this.ui.searchInput.val(),
                genre: ''
            });

            this.ui.searchInput.blur();

            if (searchvalue === '') {
                this.ui.searchForm.removeClass('edited');
            } else {
                this.ui.searchForm.addClass('edited');
            }
        },

        clearSearch: function (e) {
            this.ui.searchInput.focus();

            App.vent.trigger('about:close');
            App.vent.trigger('torrentCollection:close');
            App.vent.trigger('movie:closeDetail');

            e.preventDefault();
            this.model.set({
                keywords: '',
                genre: ''
            });

            this.ui.searchInput.val('');
            this.ui.searchForm.removeClass('edited');
        },


    });
})(window.App);
