'use strict';

require('html5-history-api');
require('bacon.jquery');
require('bacon.matchers');

var Router = require('./router'),
    AppData = require('./appData'),
    _app = null,
    _appEvent = new Bacon.Bus(),
    INITIALIZE = 0,
    READY = 1,
    onInitialize$ = _appEvent.filter(_isState, INITIALIZE).map('.1'),
    onReady$ = _appEvent.filter(_isState, READY).map('.1'),
    onReady = function onReady(f) {
        return onReady$.onValue(f);
    };

module.exports = {

    run: function run(config) {
        _app = new _App(config);
        _app.run();
    },
    app: function app() {
        return _app;
    },

    onInitialize$: onInitialize$,
    onInitialize: function onInitialize(f) {
        return onInitialize$.onValue(f);
    },
    onReady$: onReady$,
    onReady: onReady,

    AppData: AppData,
    util: require('./util'),
    events: { Events: require('./events') },
    entity: { Entity: require('./entity') },
    presenter: { Presenter: require('./presenter') },
    repository: { Repository: require('./repository') },
    storage: {
        Storage: require('./storage'),
        RESTApiStorage: require('./storage/restapi')
    },
    view: {
        View: require('./view'),
        AppView: require('./view/appView'),
        ChildView: require('./view/childView')
    }
};

function _App(config) {

    var self = this;

    this.config = _.defaults(config, {
        debug: false,
        body: 'body',
        link: 'a',
        defaultView: '',
        routes: {},
        initialPath: this.currentPath(),
        initialAppData: {}
    });

    this.router = new Router(this.config);
    this.data = new AppData(this.config.initialAppData);

    this.debug = this.config.debug;
}

_App.prototype.currentPath = function currentPath() {

    var location = window.history.location || window.location;
    return location.hash.length > 0 ?
           location.hash.slice(1) :
           location.pathname + location.search;
};

_App.prototype.route = function route(path, params) {
    if (params) {
        path += (path.indexOf('?') == -1 ? '?' : '&') + $.param(params);
    }
    history.pushState(null, null, path);
    this.dispatch(path.replace(/^.*\/\/[^\/]+/, ''));
};

_App.prototype.dispatch = function dispatch(path) {
    this.router.dispatch(path || this.currentPath());
};

_App.prototype.registerView = function registerView(name, viewClass, presenterClass) {

    var self = this;

    this.router.onRoute(name).take(1).doAction(function(route) {
        var view = new viewClass(self),
            presenter = presenterClass ? new presenterClass(self) : null;
        if (presenter) {
            view.listenTo('presenter', presenter);
            presenter.listenTo('view', view);
        }
    }).map('.path').assign(this, 'dispatch'); // re-routing
};

_App.prototype.run = function run() {

    var self = this;

    _appEvent.plug(Bacon.fromArray([INITIALIZE, READY]).map(function(state) {
        return [state, self];
    }));
    _appEvent.end();

    this.dispatch(this.config.initialPath);
};

function _isState(state, args) {
    return args[0] === state;
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
