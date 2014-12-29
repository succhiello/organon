'use strict';

var pathToRegexp = require('path-to-regexp'),
    Router = function Router(properties) {

        var routes = {},
            leave$ = new Bacon.Bus();

        properties = _.defaults(properties || {}, {
            debug: false,
            routes: {},
            defaultRoute: null
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

        this.onRoute$ = this.dispatch$
            .map(parse, properties, routes)
            .where()
            .truthy()
            .scan(null, function(prev, newRoute) {
                if (prev) {
                    leave$.push(prev);
                }
                return newRoute;
            }).changes();

        this.onLeave$ = leave$.doAction(function(){});

        if (properties.debug) {
            this.onRoute$.log('organon.Router.onRoute$');
            this.onLeave$.log('organon.Router.onLeave$');
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
        name = properties.defaultRoute;

    if (!path) {
        path = '';
    }

    paths = path.replace(/^#\//, '/').split('?');

    if (paths.length === 2) {
        paths[1].replace(/([^&=]+)=([^&]*)/g, function(_, k, v) {
            params[decodeURIComponent(k)] = decodeURIComponent(v);
        });
    }

    _.find(routes, function(route) {

        var m = route.regexp.exec(paths[0]);
        if (!m) {
            return false;
        }

        _.each(m.slice(1), function(value, i) {
            params[route.keys[i].name] = decodeURIComponent(value);
        });

        name = route.name;

        return true;
    });

    return name ? { name: name, params: params } : null;
}

module.exports = Router;
