(function (App){
    'use strict';

    App.View.FilterDropdown = App.View.Dropdown.extend({
        template: '#filter-dropdown-tpl',
        ui: {
            selected: '.selected',
        },
        events: {
            'click .item': 'closeDropdown',
        },

        initialize: function () {
            App.View.Dropdown.prototype.initialize.apply(this, arguments);
            this.model.on('change:selected', this.setLang.bind(this));
        },
        setLang: function (model) {
            var value = model.get('selected');
            this.ui.selected
                .removeClass()
                .addClass('flag toggle selected-lang')
                .addClass(value);
            App.vent.trigger(this.type + ':lang', value);
        },
        closeDropdown: function (e) {
            var value = $(e.currentTarget).attr('data-value');

            if (value) {
                this.set(value);
            }
        },
    });
})(window.App);
