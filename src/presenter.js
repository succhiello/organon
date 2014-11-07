namespace('organon.presenter', function(ns) {

    'use strict';

    var Presenter = ns.Presenter = function Presenter(app, properties) {

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
                return [[this.bus[name]], function(prev, value) { return _.clone(f.call(this, prev, value), true); }];
            }, this).flatten(true).value())
        );

        if (properties.initialize) {
            properties.initialize.call(this);
        }
    };

    Presenter.prototype.viewModelChanges = function viewModelChanges(mapping) {
        return (mapping ? this.viewModel.map(mapping) : this.viewModel).skipDuplicates(_.isEqual).changes();
    };
});
