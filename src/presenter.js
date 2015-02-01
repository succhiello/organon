'use strict';

var Presenter = function Presenter(app, properties) {

    var self = this;

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
            self.bus[name] = new Bacon.Bus();
            return [[self.bus[name]], function(prev, value) { return f.call(self, _.clone(prev, true), value); }];
        }).flatten(true).value())
    );

    if (properties.initialize) {
        properties.initialize.call(this);
    }
};

Presenter.prototype.viewModelChanges = function viewModelChanges(mapping) {
    return (mapping ? this.viewModel.map(mapping) : this.viewModel).skipDuplicates(_.isEqual).changes();
};

module.exports = Presenter;
