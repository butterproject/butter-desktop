(function (App) {
    'use strict';

    App.View.MovieDetail = App.View.GenericDetail.extend({
        regions: {
            ActionBar:  '#action-bar',
            DetailMeat: '#detail-meat'
        },
        loadComponents: function() {
            this.showView(this.ActionBar, new App.View.ActionBar({
                model: this.model
            }));

            this.showView(this.DetailMeat, new App.View.DetailMeat({
                model: this.model
            }));
        }
    });

})(window.App);
