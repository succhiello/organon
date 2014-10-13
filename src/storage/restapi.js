namespace('organon.storage', function(ns) {

    'use strict';

    var RESTApiStorage = ns.RESTApiStorage = function RESTApiStorage(properties) {

        organon.storage.Storage.call(this, properties);

        this.pathPrefix = this.pathPrefix || '';
        this.deleteMethod = this.deleteMethod || 'delete';
    };

    function _makeAjaxParams(type, pathPrefix, path, data) {
        return {
            type: type,
            url: pathPrefix + path,
            data: data
        };
    }

    RESTApiStorage.prototype.makeSetItemStream = function makeSetItemStream(upstream, path) {
        return upstream.map(_makeAjaxParams, 'post', this.pathPrefix, path).ajax();
    };

    RESTApiStorage.prototype.makeGetItemStream = function makeGetItemStream(upstream, path) {
        return upstream.map(function(params) {
            return $.param(params || {});
        }).map(_makeAjaxParams, 'get', this.pathPrefix, path).ajax();
    };

    RESTApiStorage.prototype.makeRemoveItemStream = function makeRemoveItemStream(upstream, path) {
        return upstream.map(_makeAjaxParams, this.deleteMethod, this.pathPrefix, path).ajax();
    };
});
