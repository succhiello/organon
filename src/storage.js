namespace('organon.storage', function(ns) {

    'use strict';

    var Storage = ns.Storage = function Storage(properties) {
        _.assign(this, properties || {});
        this.notImplemented = new Bacon.Error('not implemented.');
    };

    Storage.prototype.setItem = function setItem(path, data) {
        return Bacon.once(this.notImplemented);
    };

    Storage.prototype.getItem = function getItem(path, params) {
        return Bacon.once(this.notImplemented);
    };

    Storage.prototype.removeItem = function removeItem(path, params) {
        return Bacon.once(this.notImplemented);
    };
});
