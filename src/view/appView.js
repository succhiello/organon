var View = require('../view'),
    inherit = require('../util').inherit,
    AppView = inherit(View, function AppView(app, properties) {

        this.app = app;

        properties = _.defaults(properties || {}, {
            name: this.name || ''
        });

        this.onLoad$ = app.router.onRoute(properties.name).map('.params');
        this.onLeave$ = app.router.onLeave(properties.name).map('.params');

        this.on$ = {
            load: this.onLoad$,
            leave: this.onLeave$
        };

        View.call(this, properties);
    });

AppView.prototype.onLoad = function onLoad(f) {
    return this.onLoad$.onValue(_.bind(f, this));
}

AppView.prototype.onLeave = function onLeave(f) {
    return this.onLeave$.onValue(_.bind(f, this));
}

module.exports = AppView;
