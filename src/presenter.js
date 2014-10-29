namespace('organon.presenter', function(ns) {

    'use strict';

    ns.Presenter = function Presenter(app, properties) {

        properties = _.defaults(properties || {}, {
            initialViewModel: this.initialViewModel || {},
            busDefs: this.busDefs || {},
            initialize: this.initialize || null
        });

        this.app = app;
        this.bus = {};
        this.viewModel = Bacon.update.apply(
            null,
            [properties.initialViewModel].concat(_(properties.busDefs).map(function(f, name) {
                this.bus[name] = new Bacon.Bus();
                return [[this.bus[name]], _.bind(f, this)];
            }, this).flatten(true).value())
        );

        if (properties.initialize) {
            properties.initialize.call(this);
        }
    };
});
