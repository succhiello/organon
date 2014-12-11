'use strict';

var util = require('./util'),
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
        this._interfaceDefs = _.mapValues(properties.interfaceDefs, function(v) {
            return _.defaults(v, defaultInterfaceDef);
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
