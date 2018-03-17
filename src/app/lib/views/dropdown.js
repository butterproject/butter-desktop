(function (App){
    'use strict';

    App.View.Dropdown = Marionette.View.extend({
        template: '#dropdown-tpl',
        ui: {
            selected: '.selected'
        },
        events: {
            'click .close-drodpown': 'closeDropdown'
        },

        initialize: function () {
            var self = this;

            this.type = this.model.get('type');
            this.selected = this.model.get('selected');
            this.options = this.model.get('options');
            this.hasNull = this.model.get('hasNull');

            if (this.hasNull) {
                this.options = Object.assign({}, {none: undefined}, this.options);
                this.model.set('options', this.options);
            } else if (!this.selected && this.options) {
                var options = Object.keys(this.options);
                if (options.length) {
                    this.selected = options.pop();
                }
            }
        },

        onAttach: function () {
            if (this.selected && this.selected !== 'none') {
                this.set(this.selected);
            }
        },

        update: function (newOptions) {
            if (this.hasNull) {
                newOptions = Object.assign({}, {none: undefined}, newOptions);
            }
            this.model.set('options', newOptions);
            this.options = newOptions;
            this.render();
        },

        set: function (value) {
            this.model.set('selected', value);
        },

        closeDropdown: function (e) {
            var value = $(e.currentTarget).attr('data-value');

            if (value) {
                this.set(value);
            }
        },
    });
})(window.App);
