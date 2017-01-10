(function (App) {
    'use strict';

    App.View.MovieDetail = App.View.GenericDetail.extend({
        regions: {
            ActionBar:  '#action-bar',
            DetailCard: '#detail-card'
        },
        loadComponents: function() {
            this.showView(this.ActionBar, new App.View.ActionBar({
                model: this.model
            }));

            this.showView(this.DetailCard, new App.View.DetailCard({
                model: this.model
            }));
        }
    });

})(window.App);
