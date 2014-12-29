var View = require('../view'),
    inherit = require('../util').inherit,
    AppView = inherit(View, function AppView(app, properties) {

        this.app = app;

        properties = _.defaults(properties || {}, {
            name: this.name || ''
        });

        this.onPreLoad$ = app.onPreLoadView(properties.name);
        this.onLoad$ = app.onLoadView(properties.name);
        this.onPostLoad$ = app.onPostLoadView(properties.name);
        this.onLeave$ = app.onLeaveView(properties.name);

        View.call(this, properties);
    });

AppView.prototype.onPreLoad = function onPreLoad(f) {
    return this.onPreLoad$.onValue(_.bind(f, this));
}

AppView.prototype.onLoad = function onLoad(f) {
    return this.onLoad$.onValue(_.bind(f, this));
}

AppView.prototype.onPostLoad = function onPostLoad(f) {
    return this.onPostLoad$.onValue(_.bind(f, this));
}

AppView.prototype.onLeave = function onLeave(f) {
    return this.onLeave$.onValue(_.bind(f, this));
}

module.exports = AppView;
