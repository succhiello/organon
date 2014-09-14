namespace('Bacon', function(ns) {

    'use strict';

    var _proxyEvents = {
        initialize: new Bacon.Bus(),
        ready: new Bacon.Bus()
    };

    ns.app = (function(){

        var _app = null,
            _events = _.mapValues(_proxyEvents, function(v) {
                return v.toProperty(null).skipDuplicates()
                        .where().truthy();
            });

        function _initialize(config) {
            _app = new _App(config);
        }

        function _get() {
            return _app;
        }

        function _on(eventName, f) {
            _events[eventName].onValue(f);
        }

        function _define(base, derived, properties) {

            if (arguments.length < 2) {
                throw new Error('too few arguments.');
            }

            if (_.isPlainObject(derived)) {
                properties = derived;
                derived = function() { base.apply(this, arguments); };
            }

            derived.prototype = _.create(base.prototype, _.assign(properties || {}, {constructor: derived}));
            return derived;
        }

        return {
            initialize: _initialize,
            get: _get,
            on: _on,
            define: _define,
            inherit: _define,
        };
    })();

    function _App(config) {

        this.currentPath = function currentPath() {

            var location = history.location || document.location;
            return location.hash.length > 0 ?
                   location.hash.slice(1) :
                   location.pathname + location.search;
        }

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
                regexp: _pathtoRegexp(k, keys),
                keys: keys,
                view: v
            };
        }),
            _event = new Bacon.Bus(),
            _path = new Bacon.Bus(),
            _eventNames = [
                'preLoadView',
                'loadView',
                'postLoadView',
                'preRenderView',
                'renderView',
                'postRenderView',
            ],
            self = this;

        this.observe = function observe(eventInfo, f) {
            return _onValue(_event.where().containerOf(eventInfo), f);
        }

        this.on = function on(eventInfo, f) {
            return _onValue(this.observe(_makeEventInfo(eventInfo)).map('.params'), f);
        }

        this.trigger = function trigger(eventName, value, params) {
            _event.push({event: eventName, value: value, params: params})
        }

        this.route = function route(path, params) {
            if (params) {
                path += (path.indexOf('?') == -1 ? '?' : '&') + $.param(params);
            }
            history.pushState(null, null, path);
            this.dispatch(path.replace(/^.*\/\/[^\/]+/, ''));
        }

        this.loadView = function loadView(view, params) {
            this.trigger('preLoadView', view, params);
            this.trigger('loadView', view, params);
            this.trigger('postLoadView', view, params);
        };

        this.dispatch = function dispatch(path) {
            _path.push(path || this.currentPath());
        }

        _.each(_eventNames, function(event) {
            self['on' + _capitalize(event)] = function(value, f) {
                return self.on({event: event, value: value}, f);
            }
        });

        _path.map(_parse).onValue(function(viewInfo) {
            self.loadView(viewInfo.view, viewInfo.params);
        });

        _proxyEvents.initialize.push(this);
        _proxyEvents.initialize.end();

        _proxyEvents.ready.push(this);
        _proxyEvents.ready.end();

        this.dispatch(config.initialPath);

        function _onValue(stream, f) {
            return _.isUndefined(f) ? stream : stream.onValue(f);
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

        function _capitalize(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }

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

        function _pathtoRegexp(path, keys, sensitive, strict) {
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
        }
    }
});

Bacon.app.on('ready', function(app) {

    $(app.config.body).clickE(app.config.link)
        .doAction('.preventDefault')
        .map('.target.href')
        .assign(app, 'route');

    $(window).on('popstate', function(e) {
        app.dispatch();
    });
});
