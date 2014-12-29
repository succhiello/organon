'use strict';

require('bacon.jquery');
require('bacon.matchers');

var util = require('./util'),
    _app = null,
    _appEvent = new Bacon.Bus(),
    onReady = null;

module.exports.run = function run(config) {
    _app = new _App(config);
};

module.exports.app = function app() {
    return _app;
};

module.exports.on = function on(eventInfo, f) {
    return _on(_appEvent, eventInfo, f);
};

module.exports.onInitialize = function onInitialize(f) {
    return _on(_appEvent, 'initialize', f);
};

onReady = module.exports.onReady = function onReady(f) {
    return _on(_appEvent, 'ready', f);
};

module.exports.util = util;
module.exports.events = { Events: require('./events') };
module.exports.entity = { Entity: require('./entity') };
module.exports.presenter = { Presenter: require('./presenter') };
module.exports.repository = { Repository: require('./repository') };
module.exports.storage = {
    Storage: require('./storage'),
    RESTApiStorage: require('./storage/restapi')
};
module.exports.view = {
    View: require('./view'),
    AppView: require('./view/appView'),
    ChildView: require('./view/childView')
};

function _App(config) {

    this.currentPath = function currentPath() {

        var location = history.location || document.location;
        return location.hash.length > 0 ?
               location.hash.slice(1) :
               location.pathname + location.search;
    };

    this.config = _.defaults(config, {
        debug: false,
        body: 'body',
        link: 'a',
        defaultView: '',
        routes: {},
        initialPath: this.currentPath()
    });

    var _routes = _.map(this.config.routes, function(v, k) {
        var keys = [];
        return {
            regexp: util.pathToRegexp(k, keys),
            keys: keys,
            view: v
        };
    }),
        _event = new Bacon.Bus(),
        _path = new Bacon.Bus(),
        _view = new Bacon.Bus(),
        self = this;

    this.debug = this.config.debug;

    this.observe = function observe(eventInfo, f) {
        return _observe(_event, eventInfo, f);
    };

    this.on = function on(eventInfo, f) {
        return _on(_event, eventInfo, f);
    };

    this.trigger = function trigger(eventName, value, params) {
        _trigger(_event, eventName, value, params);
    };

    this.route = function route(path, params) {
        if (params) {
            path += (path.indexOf('?') == -1 ? '?' : '&') + $.param(params);
        }
        history.pushState(null, null, path);
        this.dispatch(path.replace(/^.*\/\/[^\/]+/, ''));
    };

    this.loadView = function loadView(view, params) {
        _view.push({view: view, params: params});
    };

    this.dispatch = function dispatch(path) {
        _path.push(path || this.currentPath());
    };

    _addEventRegisters(this, [
        'preLoadView', 'loadView', 'postLoadView',
        'preRenderView', 'renderView', 'postRenderView',
        'leaveView'
    ]);

    _event.plug(Bacon.mergeAll(
        _view.map(_makeViewEventInfo, 'preLoadView'),
        _view.map(_makeViewEventInfo, 'loadView'),
        _view.map(_makeViewEventInfo, 'postLoadView')
    ));

    _view.plug(_path.scan(null, function(viewInfo, path) {
        if (viewInfo) {
            self.trigger('leaveView', viewInfo.view);
        }
        return _parse(path);
    }).where().truthy());

    _trigger(_appEvent, 'initialize', 'app', this);
    _trigger(_appEvent, 'ready', 'app', this);

    this.dispatch(config.initialPath);

    function _parse(path) {

        if (path) {
            path = path.replace(/^#\//, '/');
        } else {
            path = '';
        }

        var paths = path.split('?'),
            params = {};
        if (paths.length === 2) {
            paths[1].replace(/([^&=]+)=([^&]*)/g, function() {
                params[decodeURIComponent(arguments[1])] = decodeURIComponent(arguments[2]);
            });
        }

        var viewInfo = {
            view: config.defaultView,
            params: params
        };
        _.find(_routes, function(route) {

            var m = route.regexp.exec(paths[0]);
            if (!m) {
                return false;
            }

            _.each(m.slice(1), function(value, i) {
                params[route.keys[i].name] = decodeURIComponent(value);
            });

            viewInfo.view = route.view;
            viewInfo.params = params;

            return true;
        });

        return viewInfo;
    }
}

function _addEventRegisters(obj, eventNames) {
    _.each(eventNames, function(event) {
        obj['on' + util.capitalize(event)] = function(value, f) {
            return obj.on({event: event, value: value}, f);
        }
    }, obj);
}

function _trigger(bus, eventName, value, params) {
    bus.push({event: eventName, value: value, params: params})
}

function _makeViewEventInfo(eventName, viewInfo) {
    return {
        event: eventName,
        value: viewInfo.view,
        params: viewInfo.params
    }
}

function _makeEventInfo(info) {
    if (_.isObject(info)) {
        return info;
    } else if (_.isString(info)) {
        return _(['event', 'value']).zipObject(info.split(':')).omit(function(v) { return _.isUndefined(v); }).value();
    } else {
        throw new TypeError('invalid event info value "' + info + '".');
    }
}

function _on(stream, eventInfo, f) {
    return _onValueOrStream(_observe(stream, _makeEventInfo(eventInfo)).map('.params'), f);
}

function _observe(stream, eventInfo, f) {
    return _onValueOrStream(stream.where().containerOf(eventInfo), f);
}

function _onValueOrStream(stream, f) {
    return _.isUndefined(f) ? stream : stream.onValue(f);
}

onReady(function(app) {

    $(app.config.body).clickE(app.config.link)
        .doAction('.preventDefault')
        .map('.target.href')
        .assign(app, 'route');

    $(window).on('popstate', function(e) {
        app.dispatch();
    });
});
