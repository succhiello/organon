namespace('organon.presenter', function(ns) {

    'use strict';

    ns.Presenter = function Presenter(app, properties) {

        _.assign(this, properties || {});

        this.app = app;

        this.viewModel = Bacon.update.apply(
            null,
            [this.viewModel].concat(_(this.bus).map(function(f, name) {
                this.bus[name] = new Bacon.Bus();
                return [[this.bus[name]], _.bind(f, this)];
            }, this).flatten(true).value())
        );

        if (this.initialize) {
            this.initialize.call(this);
        }
    };
});
