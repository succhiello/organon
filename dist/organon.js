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

	var util = __webpack_require__(7),
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
	module.exports.entity = { Entity: __webpack_require__(8) };
	module.exports.presenter = { Presenter: __webpack_require__(9) };
	module.exports.repository = { Repository: __webpack_require__(10) };
	module.exports.storage = {
	    Storage: __webpack_require__(11),
	    RESTApiStorage: __webpack_require__(12)
	};
	module.exports.view = {
	    View: __webpack_require__(13),
	    AppView: __webpack_require__(14)
	};

	function _App(config) {

	    this.currentPath = function currentPath() {

	        var location = history.location || document.location;
	        return location.hash.length > 0 ?
	               location.hash.slice(1) :
	               location.pathname + location.search;
	    };

	    this.config = _.defaults(config, {
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

	module.exports.pathToRegexp = function pathToRegexp(path, keys, sensitive, strict) {
	    if (path instanceof RegExp) return path;
	    if (path instanceof Array) path = '(' + path.join('|') + ')';
	    path = path
	        .concat(strict ? '' : '/?')
	        .replace(/\/\(/g, '(?:/')
	        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
	            keys.push({ name: key, optional: !! optional });
	            slash = slash || '';
	            return ''
	                + (optional ? '' : slash)
	                + '(?:'
	                + (optional ? slash : '')
	                + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
	                + (optional || '');
	        })
	        .replace(/([\/.])/g, '\\$1')
	        .replace(/\*/g, '(.*)');
	    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
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
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_) {'use strict';

	module.exports = function Entity(initialValue) {
	    _.assign(this, initialValue);
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5)))

/***/ },
/* 9 */
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
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, Bacon) {'use strict';

	var util = __webpack_require__(7),
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
	        util.pathToRegexp(path, keys);
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
/* 11 */
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
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Storage = __webpack_require__(11),
	    inherit = __webpack_require__(7).inherit,
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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(_, $) {'use strict';

	var View = function View(app, properties) {

	        properties = _.defaults(properties || {}, {
	            childDefs: this.childDefs || {},
	            template: this.template || '',
	            name: this.name || '',
	            el: this.el || '',
	            presenter: this.presenter || null,
	            initialize: this.initialize || null
	        });

	        this.app = app;

	        this.children = _.mapValues(properties.childDefs, function(v) {
	            return _.isPlainObject(v) ? v : { view: v };
	        });

	        this.presenter = properties.presenter;

	        this._template = properties.template;
	        this.name = properties.name;
	        this.el = properties.el;
	        this.$el = $(properties.el);

	        this.onRender().assign(this, 'renderTemplate', this._template);

	        _.forIn(this.children, function(v) {
	            this.onPostRender().map(v.map).assign(v.view, 'render');
	        }, this);

	        if (properties.initialize) {
	            properties.initialize.call(this);
	        }
	    };

	View.prototype.onPreRender = function onPreRender(f) {
	    return this.app.onPreRenderView(this.name, f);
	}

	View.prototype.onRender = function onRender(f) {
	    return this.app.onRenderView(this.name, f);
	}

	View.prototype.onPostRender = function onPostRender(f) {
	    return this.app.onPostRenderView(this.name, f);
	}

	View.prototype.renderHTML = function renderHTML(html) {
	    $(this.el).html(html);
	};

	View.prototype.renderTemplate = function renderTemplate(template, data) {
	    this.renderHTML(template(data));
	};

	View.prototype.render = function render(data) {
	    this.app.trigger('preRenderView', this.name, data);
	    this.app.trigger('renderView', this.name, data);
	    this.app.trigger('postRenderView', this.name, data);
	};

	View.prototype.showElement = function showElement($el, isShown) {
	    if (_.isString($el)) {
	        $el = $(this.el).find($el);
	    }
	    if (isShown) {
	        $el.show();
	    } else {
	        $el.hide();
	    }
	};

	module.exports = View;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(5), __webpack_require__(6)))

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var View = __webpack_require__(13),
	    inherit = __webpack_require__(7).inherit,
	    AppView = inherit(View, function AppView(app, properties) {

	        View.call(this, app, properties);
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

	module.exports = AppView;


/***/ }
/******/ ])
});
