'use strict';

require('html5-history-api');
require('bacon.jquery');
require('bacon.matchers');

var Router = require('./router'),
    AppData = require('./appData'),
    _apps = {},
    _appEvent = new Bacon.Bus(),
    INITIALIZE = 0,
    READY = 1,
    _onInitialize$ = _appEvent.filter(_isState, INITIALIZE).map('.1'),
    _onReady$ = _appEvent.filter(_isState, READY).map('.1');

module.exports = {

    run: function run(config) {
        _create(config).run();
    },

    app: function app(id) {
        id = id || '';
        return _apps[id];
    },

    onInitialize$: function onInitialize$(id) {
        id = id || '';
        return _onInitialize$.filter(function(app) { return app.id() === id; });
    },
    onInitialize: function onInitialize(/* id?: string, f: (app: _App) => void */) {
        var args = _makeArgs(arguments);
        return this.onInitialize$(args[0]).onValue(args[1]);
    },
    onReady$: function onReady$(id) {
        id = id || '';
        return _onReady$.filter(function(app) { return app.id() === id; });
    },
    onReady: function onReady(/* id?: string, f: (app: _App) => void */) {
        var args = _makeArgs(arguments);
        return this.onReady$(args[0]).onValue(args[1]);
    },

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

    var id = '';

    this.config = _.defaults(config || {}, {
        id: '',
        debug: false,
        body: 'body',
        link: 'a',
        defaultPath: null,
        routes: {},
        initialPath: this.currentPath(),
        initialAppData: {}
    });

    id = this.config.id;

    this.debug = this.config.debug;
    this.router = new Router(this.config);
    this.data = new AppData(this.config.initialAppData);

    if (this.config.defaultPath) {
        this.router.errors$.onError(this, 'route', this.config.defaultPath, void 0);
    }

    this.id = function() { return id; }
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

_App.prototype.onRouteFirst = function onRouteFirst(name, f) {

    this.router.onRoute(name)
        .take(1)
        .doAction(f)
        .map('.path')
        .assign(this, 'dispatch'); // re-routing
};

_App.prototype.registerView = function registerView(name, viewClass, presenterClass) {

    var self = this;

    this.onRouteFirst(name, function(route) {
        var view = new viewClass(self),
            presenter = presenterClass ? new presenterClass(self) : null;
        if (presenter) {
            view.listenTo('presenter', presenter);
            presenter.listenTo('view', view);
        }
    });
};

_App.prototype.run = function run() {

    var self = this;

    _appEvent.plug(Bacon.fromArray([INITIALIZE, READY]).map(function(state) {
        return [state, self];
    }));

    this.dispatch(this.config.initialPath);
};

function _create(config) {

    var app = new _App(config),
        id = app.id();

    if (!_.isUndefined(_apps[id])) {
        throw new Error('app "' + id + '" already exists.');
    }

    _apps[id] = app;
    return app;
}

function _makeArgs(args) {
    var id = '',
        f = null;
    if (args.length === 1) {
        f = args[0];
    } else if (args.length === 2) {
        id = args[0];
        f = args[1];
    } else {
        throw new Error('invalid arguments');
    }

    return [id, f];
}

function _isState(state, args) {
    return args[0] === state;
}

module.exports.onReady(function(app) {

    $(app.config.body).clickE(app.config.link)
        .doAction('.preventDefault')
        .map('.target.href')
        .assign(app, 'route');

    $(window).on('popstate', function(e) {
        app.dispatch();
    });
});
