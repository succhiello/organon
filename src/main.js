'use strict';

require('bacon.jquery');
require('bacon.matchers');

var Router = require('./router'),
    _app = null,
    _appEvent = new Bacon.Bus(),
    onReady = null,
    INITIALIZE = 0,
    READY = 1;

module.exports.run = function run(config) {
    _app = new _App(config);
};

module.exports.app = function app() {
    return _app;
};

module.exports.onInitialize = function onInitialize(f) {
    return _appEvent.filter(isState, INITIALIZE).map('.params').onValue(f);
};

onReady = module.exports.onReady = function onReady(f) {
    return _appEvent.filter(isState, READY).map('.params').onValue(f);
};

module.exports.Router = Router;
module.exports.util = require('./util');
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

    this.router = new Router(this.config);

    this.debug = this.config.debug;

    this.route = function route(path, params) {
        if (params) {
            path += (path.indexOf('?') == -1 ? '?' : '&') + $.param(params);
        }
        history.pushState(null, null, path);
        this.dispatch(path.replace(/^.*\/\/[^\/]+/, ''));
    };

    this.dispatch = function dispatch(path) {
        this.router.dispatch(path || this.currentPath());
    };
    this.onLeaveView = this.router.onLeave;

    _appEvent.push({state: INITIALIZE, params: this});
    _appEvent.push({state: READY, params: this});

    this.dispatch(config.initialPath);
}

function isState(state, appEvent) {
    return appEvent.state === state;
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
