namespace('bacon.app', function(ns) {

    'use strict';

    var Repository = ns.Repository = function Repository(storage, properties) {

        _.assign(this, _.defaults(properties || {}, {interface: {}}));
        this.storage = storage;

        _.defaults(this.interface, {
            add: {
                exchanger: '.model.get'
            },
            bulkAdd: {
                exchanger: _fromEntities
            },
            find: {
                exchanger: _toEntity
            },
            findAll: {
                exchanger: _toEntities
            },
            remove: {
            }
        });
    };

    Repository.prototype.getPath = function getPath(func) {
        return this.interface[func].path || this.path;
    }

    Repository.prototype.add = function add(entity) {
        return Bacon.once(entity).map(this.interface.add.exchanger).flatMap(this.storage, 'setItem', this.getPath('add'));
    }

    Repository.prototype.bulkAdd = function bulkAdd(entities) {
        return Bacon.once(entities).map(this.interface.bulkAdd.exchanger).flatMap(this.storage, 'setItem', this.getPath('bulkAdd'));
    }

    Repository.prototype.find = function find(params) {
        return this.storage.getItem(this.getPath('find'), params).map(this.interface.find.exchanger);
    }

    Repository.prototype.findAll = function findAll(params) {
        return this.storage.getItem(this.getPath('findAll'), params).map(this.interface.findAll.exchanger);
    }

    Repository.prototype.remove = function remove(params) {
        return this.storage.removeItem(this.getPath('remove'), params);
    }

    function _fromEntities(entities) {
        return _.map(entities, function(entity) {
            return entity.model.get();
        });
    }

    function _toEntity(result) {
        return new bacon.app.Entity(result);
    }

    function _toEntities(result) {
        return _.map(result.data, _toEntity);
    }
});
