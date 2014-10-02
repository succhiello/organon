namespace('organon.storage', function(ns) {

    'use strict';

    var RESTApiStorage = ns.RESTApiStorage = function RESTApiStorage(properties) {

        organon.storage.Storage.call(this, properties);

        this.pathPrefix = this.pathPrefix || '';
        this.deleteMethod = this.deleteMethod || 'delete';
    };

    RESTApiStorage.prototype.request = function request(method, path, data) {
        return Bacon.$.lazyAjax({
            type: method,
            url: this.pathPrefix + path,
            data: data
        });
    };

    RESTApiStorage.prototype.setItem = function setItem(path, data) {
        return this.request('post', path, data);
    };

    RESTApiStorage.prototype.getItem = function getItem(path, params) {
        return this.request('get', path, $.param(params || {}));
    };

    RESTApiStorage.prototype.removeItem = function removeItem(path, params) {
        return this.request(this.deleteMethod, path, params);
    };
});
