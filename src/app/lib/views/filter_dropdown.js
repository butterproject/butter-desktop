
(function (App){
    'use strict';

    App.View.FilterDropdown = App.View.Generic(App.View.Dropdown, {
        template: '#filter-dropdown-tpl',
        kind: 'filter',
        ui: {
            selected: '.selected',
            items: '.filter-item'
        },
        events: {
            'click .filter-item': 'closeDropdown'
        },

        initialize: function () {
            App.View.Dropdown.prototype.initialize.apply(this, arguments);
        },
        onShow: function () {
            this.model.get('selected') && this._setValue.apply(this, [true]);
            this.bindModelEvent('change:selected', this._setValue);
        },
        prettyValue: function(key) {
            return i18n.__(this.options[key]);
        },
        _setValue: function (init) {
            var key = this.model.get('selected');
            console.log(this.kind + 'Dropdown._setValue(%s)', this.type, key);
            $('.selected', this.el).html(this.prettyValue(key));
            $('.filter-item', this.el).removeClass('hidden');
            // HACK
            $('.filter-item', this.el).closest(`[data-value="${key}"]`).addClass('hidden');

            if (init !== true) {
                this.setValue.bind(this)(key);
            }
        },
        setValue: function (key) {
            App.vent.trigger(this.kind + ':' + this.type, key);
        },
        closeDropdown: function (e) {
            var value = $(e.currentTarget).attr('data-value');

            if (value) {
                this.set(value);
            }
        }
    });

    App.View.SelectorDropdown = App.View.FilterDropdown.extend({
        template: '#selector-dropdown-tpl',
        kind: 'selector',
        prettyValue: function(key) {
            return key;
        }
    });
})(window.App);
