var View = require('../view'),
    inherit = require('../util').inherit,
    AppView = inherit(View, function AppView(app, properties) {

        var self = this,
            listenToFunc = null;

        this.app = app;

        properties = _.defaults(properties || {}, {
            name: this.name || ''
        });

        this.onLeave$ = app.router.onLeave(properties.name).map('.params');
        this.onLoad$ = app.router.onRoute(properties.name).map('.params');
        this.isLoaded$ = this.onLoad$.map(true).merge(this.onLeave$.map(false)).toProperty(false);

        this.on$ = {
            load: this.onLoad$,
            leave: this.onLeave$
        };

        listenToFunc = this.listenTo;
        this.listenTo = function(name, publisher) {
            var filteredEvents = {
                on$: _.mapValues(publisher.on$, function(v) {
                    return v.filter(self.isLoaded$);
                })
            };
            listenToFunc(name, filteredEvents);
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
