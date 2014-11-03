namespace('organon.storage', function(ns) {

    'use strict';

    var RESTApiStorage = ns.RESTApiStorage = function RESTApiStorage(properties) {

        organon.storage.Storage.call(this, properties);

        this.pathPrefix = this.pathPrefix || '';
        this.deleteMethod = this.deleteMethod || 'delete';
    };

    function _makeAjaxParams(type, pathPrefix, params) {
        return {
            type: type,
            url: pathPrefix + params.path,
            data: params.data
        };
    }

    RESTApiStorage.prototype.makeSetItemStream = function makeSetItemStream(upstream) {
        return upstream.map(_makeAjaxParams, 'post', this.pathPrefix).ajax();
    };

    RESTApiStorage.prototype.makeGetItemStream = function makeGetItemStream(upstream) {
        return upstream.map(function(params) {
            params.data = $.param(params.data || {});
            return params;
        }).map(_makeAjaxParams, 'get', this.pathPrefix).ajax();
    };

    RESTApiStorage.prototype.makeRemoveItemStream = function makeRemoveItemStream(upstream) {
        return upstream.map(_makeAjaxParams, this.deleteMethod, this.pathPrefix).ajax();
    };
});
