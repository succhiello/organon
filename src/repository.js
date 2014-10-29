namespace('organon.repository', function(ns) {

    'use strict';

    var Repository = ns.Repository = function Repository(storage, properties) {

        var defaultInterfaceDef = {exchanger: _id};

        properties = _.defaults(properties || {}, {
            interfaceDefs: this.interfaceDefs || {}
        });

        this.storage = storage;
        this._interfaceDefs = _.mapValues(properties.interfaceDefs, function(v) {
            return _.defaults(v, defaultInterfaceDef);
        });
        _.defaults(this._interfaceDefs, {
            add: defaultInterfaceDef,
            bulkAdd: defaultInterfaceDef,
            update: defaultInterfaceDef,
            find: defaultInterfaceDef,
            findAll: defaultInterfaceDef,
            remove: {}
        });

        this._bus = {};
        this.sink = {};
        this.error = {};
        this.awaiting = {};
        _(this._interfaceDefs).keys().forEach(function(name) {
            this._bus[name] = new Bacon.Bus();
            this.sink[name] = this[name + 'SinkFactory'](this._bus[name]);
            this.error[name] = this.sink[name].errors();
            this.awaiting[name] = this._bus[name].awaiting(this.sink[name]).skipDuplicates();
        }, this);
    };

    Repository.defineInterface = function defineInterface(repository_class, name, sinkFactory) {

        repository_class.prototype[name + 'SinkFactory'] = sinkFactory;

        repository_class.prototype[name] = function(arg) {
            this._bus[name].push(arg);
        };

        repository_class.prototype[name + 'Once'] = function(arg) {
            return sinkFactory.call(this, Bacon.once(arg));
        };
    };

    Repository.prototype.getPath = function getPath(func) {
        return this._interfaceDefs[func].path || this.path;
    };

    Repository.defineInterface(Repository, 'add', function addSinkFactory(upstream) {
        return this.storage.makeSetItemStream(
            upstream.map(this._interfaceDefs.add.exchanger),
            this.getPath('add')
        );
    });

    Repository.defineInterface(Repository, 'bulkAdd', function bulkAddSinkFactory(upstream) {
        return this.storage.makeSetItemStream(
            upstream.map(this._interfaceDefs.bulkAdd.exchanger),
            this.getPath('bulkAdd')
        );
    });

    Repository.defineInterface(Repository, 'update', function updateSinkFactory(upstream) {
        return this.storage.makeSetItemStream(
            upstream.map(this._interfaceDefs.update.exchanger),
            this.getPath('update')
        );
    });

    Repository.defineInterface(Repository, 'find', function findSinkFactory(upstream) {
        return this.storage.makeGetItemStream(
            upstream,
            this.getPath('find')
        ).map(this._interfaceDefs.find.exchanger);
    });

    Repository.defineInterface(Repository, 'findAll', function findAllSinkFactory(upstream) {
        return this.storage.makeGetItemStream(
            upstream,
            this.getPath('findAll')
        ).map(this._interfaceDefs.findAll.exchanger);
    });

    Repository.defineInterface(Repository, 'remove', function removeSinkFactory(upstream) {
        return this.storage.makeRemoveItemStream(
            upstream,
            this.getPath('remove')
        );
    });

    function _id(arg) {
        return arg;
    }
});
