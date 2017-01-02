(function (App){
    'use strict';

    App.View.FilterDropdown = App.View.Dropdown.extend({
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
            this.model.on('change:selected', this.setValue.bind(this));
        },
        onShow: function () {
            this.model.get('selected') && this.setValue.apply(this);
        },
        prettyValue: function(key) {
            return i18n.__(this.values[key]);
        },
        setValue: function (model) {
            var key = this.model.get('selected');
            console.log(this.kind + 'Dropdown.setValue(%s)', this.type, key);
            this.ui.selected.html(this.prettyValue(key));
            this.ui.items.removeClass('hidden');
            // HACK
            this.ui.items.closest(`[data-value="${key}"]`).addClass('hidden');

            model && App.vent.trigger(this.kind + ':' + this.type, key);
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
