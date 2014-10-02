namespace('organon.view', function(ns) {

    var AppView = ns.AppView = organon.define(organon.view.View, function AppView(app, properties) {

        ns.View.call(this, app, properties);
    });

    AppView.prototype.onPreLoad = function onPreLoad(f) {
        return this.app.onPreLoadView(this.name, f);
    }

    AppView.prototype.onLoad = function onLoad(f) {
        return this.app.onLoadView(this.name, f);
    }

    AppView.prototype.onPostLoad = function onPostLoad(f) {
        return this.app.onPostLoadView(this.name, f);
    }

    AppView.prototype.onLeave = function onLeave(f) {
        return this.app.onLeaveView(this.name, f);
    }
});
