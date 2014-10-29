namespace('organon.repository', function(ns) {

    'use strict';

    var Repository = ns.Repository = function Repository(storage, properties) {
        _.assign(this, properties || {});
        this.storage = storage;

        this.interface = this.interface || {};
        this.interface.add = _.defaults(this.interface.add || {}, {exchanger: _id});
        this.interface.bulkAdd = _.defaults(this.interface.bulkAdd || {}, {exchanger: _id});
        this.interface.update = _.defaults(this.interface.update || {}, {exchanger: _id});
        this.interface.find = _.defaults(this.interface.find || {}, {exchanger: _id});
        this.interface.findAll = _.defaults(this.interface.findAll || {}, {exchanger: _id});
        this.interface.remove = this.interface.remove || {};

        this._bus = {};
        this.sink = {};
        this.error = {};
        this.awaiting = {};
        _(this.interface).keys().forEach(function(name) {
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
        return this.interface[func].path || this.path;
    };

    Repository.defineInterface(Repository, 'add', function addSinkFactory(upstream) {
        return this.storage.makeSetItemStream(
            upstream.map(this.interface.add.exchanger),
            this.getPath('add')
        );
    });

    Repository.defineInterface(Repository, 'bulkAdd', function bulkAddSinkFactory(upstream) {
        return this.storage.makeSetItemStream(
            upstream.map(this.interface.bulkAdd.exchanger),
            this.getPath('bulkAdd')
        );
    });

    Repository.defineInterface(Repository, 'update', function updateSinkFactory(upstream) {
        return this.storage.makeSetItemStream(
            upstream.map(this.interface.update.exchanger),
            this.getPath('update')
        );
    });

    Repository.defineInterface(Repository, 'find', function findSinkFactory(upstream) {
        return this.storage.makeGetItemStream(
            upstream,
            this.getPath('find')
        ).map(this.interface.find.exchanger);
    });

    Repository.defineInterface(Repository, 'findAll', function findAllSinkFactory(upstream) {
        return this.storage.makeGetItemStream(
            upstream,
            this.getPath('findAll')
        ).map(this.interface.findAll.exchanger);
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
