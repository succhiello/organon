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

        var sinkFunks = {
            add: _addSink,
            bulkAdd: _bulkAddSink,
            update: _updateSink,
            find: _findSink,
            findAll: _findAllSink,
            remove: _removeSink
        };

        this._bus = {};
        this.sink = {};
        this.error = {};
        this.awaiting = {};
        _(this.interface).keys().forEach(function(name) {
            this._bus[name] = new Bacon.Bus();
            this.sink[name] = sinkFunks[name].call(this, this._bus[name]);
            this.error[name] = this.sink[name].errors();
            this.awaiting[name] = this._bus[name].awaiting(this.sink[name]).skipDuplicates();
        }, this);
    };

    Repository.prototype.getPath = function getPath(func) {
        return this.interface[func].path || this.path;
    };

    Repository.prototype.add = function add(entity) {
        this._bus.add.push(entity);
    };

    Repository.prototype.addOnce = function addOnce(entity) {
        return _addSink.call(this, Bacon.once(entity));
    }

    Repository.prototype.bulkAdd = function bulkAdd(entities) {
        this._bus.bulkAdd.push(entities);
    };

    Repository.prototype.bulkAddOnce = function bulkAddOnce(entities) {
        return _bulkAddSink.call(this, Bacon.once(entities));
    }

    Repository.prototype.update = function update(entity) {
        this._bus.update.push(entity);
    };

    Repository.prototype.updateOnce = function updateOnce(entity) {
        return _updateSink.call(this, Bacon.once(entity));
    }

    Repository.prototype.find = function find(params) {
        this._bus.find.push(params);
    };

    Repository.prototype.findOnce = function findOnce(params) {
        return _findSink.call(this, Bacon.once(params));
    }

    Repository.prototype.findAll = function findAll(params) {
        this._bus.findAll.push(params);
    };

    Repository.prototype.findAllOnce = function findAllOnce(params) {
        return _findAllSink.call(this, Bacon.once(params));
    }

    Repository.prototype.remove = function remove(params) {
        this._bus.remove.push(params);
    };

    Repository.prototype.removeOnce = function removeOnce(params) {
        return _removeSink.call(this, Bacon.once(params));
    }

    function _addSink(upstream) {
        return this.storage.makeSetItemStream(
            upstream.map(this.interface.add.exchanger),
            this.getPath('add')
        );
    }

    function _bulkAddSink(upstream) {
        return this.storage.makeSetItemStream(
            upstream.map(this.interface.bulkAdd.exchanger),
            this.getPath('bulkAdd')
        );
    }

    function _updateSink(upstream) {
        return this.storage.makeSetItemStream(
            upstream.map(this.interface.update.exchanger),
            this.getPath('update')
        );
    }

    function _findSink(upstream) {
        return this.storage.makeGetItemStream(
            upstream,
            this.getPath('find')
        ).map(this.interface.find.exchanger);
    }

    function _findAllSink(upstream) {
        return this.storage.makeGetItemStream(
            upstream,
            this.getPath('findAll')
        ).map(this.interface.findAll.exchanger);
    }

    function _removeSink(upstream) {
        return this.storage.makeRemoveItemStream(
            upstream,
            this.getPath('remove')
        );
    }

    function _id(arg) {
        return arg;
    }
});
