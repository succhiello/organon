namespace('organon.repository', function(ns) {

    'use strict';

    var Repository = ns.Repository = function Repository(storage, properties) {
        _.assign(this, properties || {});
        this.storage = storage;

        this.interface.add = _.defaults(this.interface.add || {}, {exchanger: _id});
        this.interface.bulkAdd = _.defaults(this.interface.bulkAdd || {}, {exchanger: _id});
        this.interface.update = _.defaults(this.interface.update || {}, {exchanger: _id});
        this.interface.find = _.defaults(this.interface.find || {}, {exchanger: _id});
        this.interface.findAll = _.defaults(this.interface.findAll || {}, {exchanger: _id});
        this.interface.remove = this.interface.remove || {};
    };

    Repository.prototype.getPath = function getPath(func) {
        return this.interface[func].path || this.path;
    };

    Repository.prototype.add = function add(entity) {
        return Bacon.once(entity)
            .map(this.interface.add.exchanger)
            .flatMap(this.storage, 'setItem', this.getPath('add'));
    };

    Repository.prototype.bulkAdd = function bulkAdd(entities) {
        return Bacon.once(entities)
            .map(this.interface.bulkAdd.exchanger)
            .flatMap(this.storage, 'setItem', this.getPath('bulkAdd'));
    };

    Repository.prototype.update = function update(entity) {
        return Bacon.once(entity)
            .map(this.interface.update.exchanger)
            .flatMap(this.storage, 'setItem', this.getPath('update'));
    };

    Repository.prototype.find = function find(params) {
        return this.storage.getItem(this.getPath('find'), params)
            .map(this.interface.find.exchanger);
    };

    Repository.prototype.findAll = function findAll(params) {
        return this.storage.getItem(this.getPath('findAll'), params)
            .map(this.interface.findAll.exchanger);
    };

    Repository.prototype.remove = function remove(params) {
        return this.storage.removeItem(this.getPath('remove'), params);
    };

    function _id(arg) {
        return arg;
    }
});
