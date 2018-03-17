((App) => {
    App.View.Generic = function (Parent, View) {
        const _initialize = View.initialize;
        const _onBeforeDestroy = View.onDestroy;

        View.showView = function (region, view) {
            region.show(view);
            this.views['view-' + view.el] = view;
        };

        View.bindAppEvent = function (event, fn) {
            fn || console.error('no function defined');
            App.vent.on(event, fn.bind(this));
            this.appEvents[event] = fn;
        };

        View.bindModelEvent = function (event, fn) {
            fn || console.error('no function defined');
            this.model.on(event, fn.bind(this));
            this.modelEvents[event] = fn;
        };

        View.bindShortCut = function (shortcut, fn) {
            fn || console.error('no function defined');
            Mousetrap.bind(shortcut, fn.bind(this));
            this.keyboardShortCuts[shortcut] = fn;
        };

        View.initialize = function () {
            this.views = {};
            this.appEvents = {};
            this.modelEvents = {};
            this.keyboardShortCuts = {};

            _initialize && _initialize.apply(this, arguments);
        };

        View.onBeforeDestroy = function () {
            _onBeforeDestroy && _onDestroy.apply(this, arguments);

            Object.values(this.views).map(v => v.destroy());
            Object.keys(this.appEvents).map(App.vent.off);
            Object.keys(this.keyboardShortCuts).map(Mousetrap.unbind);
            if (this.model) { // if no model, no modelEvents
                Object.keys(this.modelEvents).map(this.model.off);
            }
        };

        return Parent.extend(View);
    };
})(window.App);
