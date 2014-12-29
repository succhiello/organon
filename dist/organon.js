(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("bacon.jquery"), require("bacon.matchers"), require("bacon"), require("hhtml5-history-api"), require("lodash"), require("jquery"));
	else if(typeof define === 'function' && define.amd)
		define(["bacon.jquery", "bacon.matchers", "bacon", "html5-history-api", "lodash", "jquery"], factory);
	else if(typeof exports === 'object')
		exports["organon"] = factory(require("bacon.jquery"), require("bacon.matchers"), require("bacon"), require("hhtml5-history-api"), require("lodash"), require("jquery"));
	else
		root["organon"] = factory(root["Bacon"]["$"], root["Bacon"], root["Bacon"], root["history"], root["_"], root["jQuery"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__, __WEBPACK_EXTERNAL_MODULE_4__, __WEBPACK_EXTERNAL_MODULE_5__, __WEBPACK_EXTERNAL_MODULE_6__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Bacon, history, _, $) {'use strict';

	__webpack_require__(1);
	__webpack_require__(2);

	var Router = __webpack_require__(7),
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
	module.exports.util = __webpack_require__(8);
	module.exports.events = { Events: __webpack_require__(9) };
	module.exports.entity = { Entity: __webpack_require__(10) };
	module.exports.presenter = { Presenter: __webpack_require__(11) };
	module.exports.repository = { Repository: __webpack_require__(12) };
	module.exports.storage = {
	    Storage: __webpack_require__(13),
	    RESTApiStorage: __webpack_require__(14)
	};
	module.exports.view = {
	    View: __webpack_require__(17),
	    AppView: __webpack_require__(15),
	    ChildView: __webpack_require__(16)
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(4), __webpack_require__(5), __webpack_require__(6)))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_5__;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_6__;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Bacon, _) {'use strict';

	var pathToRegexp = __webpack_require__(18),
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(5)))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {'use strict';

	module.exports.capitalize = function capitalize(str) {
	    return str.charAt(0).toUpperCase() + str.slice(1);
	}

	module.exports.assignAndDefaults = function assignAndDefaults(dst, props, defaults) {
	    return _.defaults(
	        _.assign(dst, props || {}),
	        defaults
	    );
	};

	module.exports.define = module.exports.inherit = function define(base, derived, properties) {

	    if (arguments.length < 2) {
	        throw new Error('too few arguments.');
	    }

	    if (_.isPlainObject(derived)) {
	        properties = derived;
	        derived = function() { base.apply(this, arguments); };
	    }

	    derived.prototype = _.create(base.prototype, _.assign(properties || {}, {constructor: derived}));
	    return derived;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Bacon, _) {'use strict';

	var Events = function Events(properties) {

	    var self = this,
	        events = (properties.events || self.events) || {},
	        debug = properties.debug || false;

	    self._unsubscriber = new Bacon.Bus();

	    self._unsubscriber.onValue(function(arg) {
	        delete self.ev;
	        self.ev = _.mapValues(events, function(thunk, name) {
	            var stream = thunk.call(self, arg).takeUntil(self._unsubscriber);
	            if (debug) {
	                stream.log('organon.events.' + (properties.name ? properties.name + '.' : '') + name);
	            }
	            return stream;
	        });
	    });
	};

	Events.prototype.resetEvent = function resetEvent(arg) {
	    this._unsubscriber.push(arg);
	};

	module.exports = Events;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(5)))

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {'use strict';

	module.exports = function Entity(initialValue) {
	    _.assign(this, initialValue);
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, Bacon) {'use strict';

	var Presenter = function Presenter(app, properties) {

	        var self = this;

	        properties = _.defaults(properties || {}, {
	            initialViewModel: this.initialViewModel || {},
	            busDefs: this.busDefs || {},
	            initialize: this.initialize || null
	        });

	        this.app = app;
	        this.bus = {};
	        this.viewModel = Bacon.update.apply(
	            null,
	            [properties.initialViewModel].concat(_(properties.busDefs).map(function(f, name) {
	                self.bus[name] = new Bacon.Bus();
	                return [[self.bus[name]], function(prev, value) { return f.call(self, _.clone(prev, true), value); }];
	            }).flatten(true).value())
	        );

	        if (properties.initialize) {
	            properties.initialize.call(this);
	        }
	    };

	Presenter.prototype.viewModelChanges = function viewModelChanges(mapping) {
	    return (mapping ? this.viewModel.map(mapping) : this.viewModel).skipDuplicates(_.isEqual).changes();
	};

	module.exports = Presenter;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(3)))

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, Bacon) {'use strict';

	var util = __webpack_require__(8),
	    pathToRegexp = __webpack_require__(18),
	    Repository = function Repository(storage, properties) {

	        var defaultInterfaceDef = {
	            // path: null,
	            // type: null,
	            in: null,
	            out: null,
	            sinkFactory: null
	        };

	        properties = _.defaults(properties || {}, {
	            interfaceDefs: this.interfaceDefs || {}
	        });

	        this.storage = storage;
	        this._defaultPath = properties.defaultPath;

	        if (_.isArray(properties.interfaceDefs)) {
	            properties.interfaceDefs = _.zipObject(properties.interfaceDefs);
	        }

	        this._interfaceDefs = _.mapValues(properties.interfaceDefs, function(v) {
	            return _.defaults(_.isObject(v) ? v : {}, defaultInterfaceDef);
	        });
	        _.defaults(this._interfaceDefs.add, { type: 'set' });
	        _.defaults(this._interfaceDefs.bulkAdd, { type: 'set' });
	        _.defaults(this._interfaceDefs.update, { type: 'set' });
	        _.defaults(this._interfaceDefs.find, { type: 'get' });
	        _.defaults(this._interfaceDefs.findAll, { type: 'get' });
	        _.defaults(this._interfaceDefs.remove, { type: 'remove' });

	        this.bus = {};
	        this.sink = {};
	        this.error = {};
	        this.awaiting = {};
	        _.forEach(this._interfaceDefs, function(def, name) {
	            this.bus[name] = new Bacon.Bus();
	            this.sink[name] = (def.sinkFactory || _genericSinkFactory).call(this, name, this.bus[name]);
	            this.error[name] = this.sink[name].errors();
	            this.awaiting[name] = this.bus[name].awaiting(this.sink[name]);
	        }, this);
	    };

	Repository.prototype.push = function push(name, arg) {
	    this.bus[name].push(arg);
	};

	Repository.prototype.once = function once(name, arg) {
	    return (this._interfaceDefs[name].sinkFactory || _genericSinkFactory).call(this, name, Bacon.once(arg));
	};

	Repository.defineInterface = function defineInterface(repository_class, name) {
	    repository_class.prototype[name] = function(arg) { return this.push(name, arg); }
	    repository_class.prototype[name + 'Once'] = function(arg) { return this.once(name, arg); }
	};

	_.forEach(['add', 'bulkAdd', 'update', 'find', 'findAll', 'remove'], function(name) {
	    Repository.defineInterface(Repository, name);
	});

	function _genericSinkFactory(name, upstream) {
	    var def = _getInterfaceDef.call(this, name),
	        sink = null;
	    if (def['in']) {
	        upstream = upstream.map(def['in']);
	    }
	    sink = this.storage['make' + util.capitalize(def['type']) + 'ItemStream'](
	        _makeStorageParams(upstream, def['path'])
	    );
	    if (def['out']) {
	        sink = sink.map(def['out']);
	    }
	    return sink;
	}

	function _getInterfaceDef(func) {
	    return _.defaults(this._interfaceDefs[func] || {}, {
	        path: this._defaultPath,
	    });
	};

	function _makeStorageParams(upstream, path) {

	    var dataStream = upstream,
	        pathStream = path,
	        keys = [];

	    if (!_.isString(path)) {
	        pathStream = upstream.map(path);
	    } else {
	        pathToRegexp(path, keys);
	        keys = _.map(keys, 'name');
	        if (keys.length > 0) {
	            dataStream = upstream.map(function(params) { return _.omit(params, keys); });
	            pathStream = upstream.map(function(params) {
	                return _.reduce(keys, function(result, key) {
	                    return result.replace(':' + key, params[key]);
	                }, path);
	            });
	        }
	    }

	    return Bacon.combineTemplate({
	        data: dataStream,
	        path: pathStream
	    });
	};

	module.exports = Repository;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(3)))

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, Bacon) {'use strict';

	var Storage = function Storage(properties) {
	        _.assign(this, properties || {});
	        this.notImplemented = new Bacon.constant(new Bacon.Error('not implemented.'));
	    };

	Storage.prototype.makeSetItemStream = function makeSetItemStream(upstream) {
	    return this.notImplemented;
	};

	Storage.prototype.makeGetItemStream = function makeGetItemStream(upstream) {
	    return this.notImplemented;
	};

	Storage.prototype.makeRemoveItemStream = function makeRemoveItemStream(upstream) {
	    return this.notImplemented;
	};

	module.exports = Storage;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(3)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Storage = __webpack_require__(13),
	    inherit = __webpack_require__(8).inherit,
	    RESTApiStorage = inherit(Storage, function RESTApiStorage(properties) {

	        Storage.call(this, properties);

	        this.pathPrefix = this.pathPrefix || '';
	        this.deleteMethod = this.deleteMethod || 'delete';
	    });

	function _makeAjaxParams(type, pathPrefix, params) {
	    return {
	        type: type,
	        url: pathPrefix + params.path,
	        data: type === 'get' ? params.data : JSON.stringify(params.data),
	        contentType: type === 'get' ? 'application/x-www-form-urlencoded' : 'application/json'
	    };
	}

	RESTApiStorage.prototype.makeSetItemStream = function makeSetItemStream(upstream) {
	    return upstream.map(_makeAjaxParams, 'post', this.pathPrefix).ajax();
	};

	RESTApiStorage.prototype.makeGetItemStream = function makeGetItemStream(upstream) {
	    return upstream.map(_makeAjaxParams, 'get', this.pathPrefix).ajax();
	};

	RESTApiStorage.prototype.makeRemoveItemStream = function makeRemoveItemStream(upstream) {
	    return upstream.map(_makeAjaxParams, this.deleteMethod, this.pathPrefix).ajax();
	};

	module.exports = RESTApiStorage;


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {var View = __webpack_require__(17),
	    inherit = __webpack_require__(8).inherit,
	    AppView = inherit(View, function AppView(app, properties) {

	        this.app = app;

	        properties = _.defaults(properties || {}, {
	            name: this.name || ''
	        });

	        this.onLoad$ = app.router.onRoute(properties.name).map('.params');
	        this.onLeave$ = app.router.onLeave(properties.name).map('.params');

	        View.call(this, properties);
	    });

	AppView.prototype.onLoad = function onLoad(f) {
	    return this.onLoad$.onValue(_.bind(f, this));
	}

	AppView.prototype.onLeave = function onLeave(f) {
	    return this.onLeave$.onValue(_.bind(f, this));
	}

	module.exports = AppView;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {var View = __webpack_require__(17),
	    inherit = __webpack_require__(8).inherit,
	    ChildView = inherit(View, function ChildView(parent, properties) {

	        properties = _.defaults(properties || {}, {
	            renderWithParent: this.renderWithParent || true,
	            parentParamsMapper: this.parentParamsMapper || null,
	            presenter: this.presenter || parent.presenter
	        });

	        this.parent = parent;

	        if (properties.renderWithParent) {
	            var parentPostRender = parent.onPostRender$;
	            if (properties.parentParamsMapper) {
	                parentPostRender = parentPostRender.map(properties.parentParamsMapper);
	            };
	            parentPostRender.assign(this, 'render');
	        }

	        View.call(this, properties);
	    });

	module.exports = ChildView;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Bacon, _, $) {'use strict';

	var inherit = __webpack_require__(8).inherit,
	    Events = __webpack_require__(9),
	    View = inherit(Events, function View(properties) {

	        var self = this,
	            ChildView = __webpack_require__(16),
	            renderEvent$ = new Bacon.Bus(),
	            PRE_RENDER = 0,
	            RENDER = 1,
	            POST_RENDER = 2;

	        properties = _.defaults(properties || {}, {
	            debug: self.debug || false,
	            childDefs: self.childDefs || {},
	            widgets: self.widgets || {},
	            template: self.template || '',
	            name: self.name || '',
	            el: self.el || '',
	            presenter: self.presenter || null,
	            initialize: self.initialize || null
	        });

	        self.render$ = new Bacon.Bus();

	        self.presenter = properties.presenter;
	        self._template = properties.template;
	        self.name = properties.name;
	        self.el = properties.el;
	        self.$el = $(properties.el);

	        Events.call(self, properties);

	        self.onPreRender$ = renderEvent$.filter(isState, PRE_RENDER).map('.data');
	        self.onRender$ = renderEvent$.filter(isState, RENDER).map('.data');
	        self.onPostRender$ = renderEvent$.filter(isState, POST_RENDER).map('.data');

	        self.render$.onValue(function(data) {

	            self.$el = $(properties.el);

	            renderEvent$.push({state: PRE_RENDER, data: data});

	            self.renderTemplate(self._template, data);

	            self.$ = _.mapValues(properties.widgets, function(widget) {
	                if (_.isString(widget)) {
	                    return self.$el.find(widget);
	                } else if(_.isFunction(widget)) {
	                    return widget.call(self, self.$el);
	                } else {
	                    return widget;
	                }
	            });
	            self.resetEvent(self.$el);

	            renderEvent$.push({state: RENDER, data: data});

	            renderEvent$.push({state: POST_RENDER, data: data});
	        });

	        self.el$ = self.onPreRender$.map($, properties.el, void 0).toProperty();

	        self.children = _.mapValues(properties.childDefs, function(v) {
	            if (_.isPlainObject(v)) {
	                return new ChildView(self, v);
	            } else {
	                return v;
	            }
	        });

	        if (properties.initialize) {
	            properties.initialize.call(self);
	        }
	    });

	View.prototype.onPreRender = function onPreRender(f) {
	    return this.onPreRender$.onValue(_.bind(f, this));
	};

	View.prototype.onRender = function onRender(f) {
	    return this.onRender$.onValue(_.bind(f, this));
	};

	View.prototype.onPostRender = function onPostRender(f) {
	    return this.onPostRender$.onValue(_.bind(f, this));
	};

	View.prototype.renderHTML = function renderHTML(html) {
	    this.$el.html(html);
	};

	View.prototype.renderTemplate = function renderTemplate(template, data) {
	    this.renderHTML(template(data));
	};

	View.prototype.render = function render(data) {
	    this.render$.push(data);
	};

	View.prototype.showElement = function showElement($el, isShown) {
	    if (_.isString($el)) {
	        $el = this.$el.find($el);
	    }
	    if (isShown) {
	        $el.show();
	    } else {
	        $el.hide();
	    }
	};

	function isState(state, renderEvent) {
	    return renderEvent.state === state;
	}

	module.exports = View;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(3), __webpack_require__(5), __webpack_require__(6)))

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var isArray = __webpack_require__(19);

	/**
	 * Expose `pathtoRegexp`.
	 */
	module.exports = pathtoRegexp;

	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	  // Match already escaped characters that would otherwise incorrectly appear
	  // in future matches. This allows the user to escape special characters that
	  // shouldn't be transformed.
	  '(\\\\.)',
	  // Match Express-style parameters and un-named parameters with a prefix
	  // and optional suffixes. Matches appear as:
	  //
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?"]
	  // "/route(\\d+)" => [undefined, undefined, undefined, "\d+", undefined]
	  '([\\/.])?(?:\\:(\\w+)(?:\\(((?:\\\\.|[^)])*)\\))?|\\(((?:\\\\.|[^)])*)\\))([+*?])?',
	  // Match regexp special characters that should always be escaped.
	  '([.+*?=^!:${}()[\\]|\\/])'
	].join('|'), 'g');

	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {String} group
	 * @return {String}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1');
	}

	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {RegExp} re
	 * @param  {Array}  keys
	 * @return {RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys;

	  return re;
	};

	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array should be passed in, which will contain the placeholder key
	 * names. For example `/user/:id` will then contain `["id"]`.
	 *
	 * @param  {(String|RegExp|Array)} path
	 * @param  {Array}                 keys
	 * @param  {Object}                options
	 * @return {RegExp}
	 */
	function pathtoRegexp (path, keys, options) {
	  if (!isArray(keys)) {
	    options = keys;
	    keys = null;
	  }

	  keys = keys || [];
	  options = options || {};

	  var strict = options.strict;
	  var end = options.end !== false;
	  var flags = options.sensitive ? '' : 'i';
	  var index = 0;

	  if (path instanceof RegExp) {
	    // Match all capturing groups of a regexp.
	    var groups = path.source.match(/\((?!\?)/g);

	    // Map all the matches to their numeric indexes and push into the keys.
	    if (groups) {
	      for (var i = 0; i < groups.length; i++) {
	        keys.push({
	          name:      i,
	          delimiter: null,
	          optional:  false,
	          repeat:    false
	        });
	      }
	    }

	    // Return the source back to the user.
	    return attachKeys(path, keys);
	  }

	  // Map array parts into regexps and return their source. We also pass
	  // the same keys and options instance into every generation to get
	  // consistent matching groups before we join the sources together.
	  if (isArray(path)) {
	    var parts = [];

	    for (var i = 0; i < path.length; i++) {
	      parts.push(pathtoRegexp(path[i], keys, options).source);
	    }
	    // Generate a new regexp instance by joining all the parts together.
	    return attachKeys(new RegExp('(?:' + parts.join('|') + ')', flags), keys);
	  }

	  // Alter the path string into a usable regexp.
	  path = path.replace(PATH_REGEXP, function (match, escaped, prefix, key, capture, group, suffix, escape) {
	    // Avoiding re-escaping escaped characters.
	    if (escaped) {
	      return escaped;
	    }

	    // Escape regexp special characters.
	    if (escape) {
	      return '\\' + escape;
	    }

	    var repeat   = suffix === '+' || suffix === '*';
	    var optional = suffix === '?' || suffix === '*';

	    keys.push({
	      name:      key || index++,
	      delimiter: prefix || '/',
	      optional:  optional,
	      repeat:    repeat
	    });

	    // Escape the prefix character.
	    prefix = prefix ? '\\' + prefix : '';

	    // Match using the custom capturing group, or fallback to capturing
	    // everything up to the next slash (or next period if the param was
	    // prefixed with a period).
	    capture = escapeGroup(capture || group || '[^' + (prefix || '\\/') + ']+?');

	    // Allow parameters to be repeated more than once.
	    if (repeat) {
	      capture = capture + '(?:' + prefix + capture + ')*';
	    }

	    // Allow a parameter to be optional.
	    if (optional) {
	      return '(?:' + prefix + '(' + capture + '))?';
	    }

	    // Basic parameter support.
	    return prefix + '(' + capture + ')';
	  });

	  // Check whether the path ends in a slash as it alters some match behaviour.
	  var endsWithSlash = path[path.length - 1] === '/';

	  // In non-strict mode we allow an optional trailing slash in the match. If
	  // the path to match already ended with a slash, we need to remove it for
	  // consistency. The slash is only valid at the very end of a path match, not
	  // anywhere in the middle. This is important for non-ending mode, otherwise
	  // "/test/" will match "/test//route".
	  if (!strict) {
	    path = (endsWithSlash ? path.slice(0, -2) : path) + '(?:\\/(?=$))?';
	  }

	  // In non-ending mode, we need prompt the capturing groups to match as much
	  // as possible by using a positive lookahead for the end or next path segment.
	  if (!end) {
	    path += strict && endsWithSlash ? '' : '(?=\\/|$)';
	  }

	  return attachKeys(new RegExp('^' + path + (end ? '$' : ''), flags), keys);
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ }
/******/ ])
});
