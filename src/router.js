'use strict';

var pathToRegexp = require('path-to-regexp'),
    Router = function Router(properties) {

        var routes = {},
            routeState$ = null;

        properties = _.defaults(properties || {}, {
            debug: false,
            routes: {}
        });

        this.dispatch$ = new Bacon.Bus();

        routes = _.map(properties.routes, function(name, path) {
            var keys = [];
            return {
                regexp: pathToRegexp(path, keys),
                keys: keys,
                name: name
            };
        });

        routeState$ = this.dispatch$.flatMap(parse, properties, routes);

        this.errors$ = routeState$.errors();

        routeState$ = routeState$.skipErrors().scan({current: null}, function(prev, newRoute) {
            return {
                prev: prev.current,
                current: newRoute
            };
        }).changes();

        this.onLeave$ = routeState$.map('.prev').where().truthy();
        this.onLeave$.assign(); // work around for leave -> after order.
        this.onRoute$ = routeState$.map('.current');

        if (properties.debug) {
            this.onLeave$.log('organon.Router.onLeave$');
            this.onRoute$.log('organon.Router.onRoute$');
        }
    };

Router.prototype.dispatch = function dispatch(path) {
    this.dispatch$.push(path);
};

Router.prototype.on = Router.prototype.onRoute = function onRoute(pred) {
    return _.isFunction(pred) ? this.onRoute$.filter(pred) : this.onRoute$.filter(isRoute, pred);
};

Router.prototype.onLeave = function onLeave(pred) {
    return _.isFunction(pred) ? this.onLeave$.filter(pred) : this.onLeave$.filter(isRoute, pred);
};

function isRoute(name, route) {
    return route && name && route.name === name;
}

function parse(properties, routes, path) {

    var paths = [],
        params = {},
        name = null;

    if (!path) {
        path = '';
    }

    paths = path.replace(/^#\//, '/').split('?');

    _.assign(
        params,
        _(paths).at(1).compact()
            .invoke('match', /([^&=]+)=([^&]*)/g).flatten()
            .map(function(queryString) {
                return _.map(queryString.split('='), decodeURIComponent);
            })
            .zipObject().value()
    );

    _.find(routes, function(route) {

        var m = route.regexp.exec(paths[0]);
        if (!m) {
            return false;
        }

        _.each(m.slice(1), function(value, i) {
            if (!route.keys[i].optional || value) {
                params[route.keys[i].name] = decodeURIComponent(value);
            }
        });

        name = route.name;

        return true;
    });

    return name ? { name: name, params: params, path: path } : new Bacon.Error('path "' + path + '" doesn\'t match any route.');
}

module.exports = Router;
