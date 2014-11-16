'use strict';

var Storage = require('../storage'),
    inherit = require('../util').inherit,
    LocalForageStorage = inherit(Storage, function LocalForageStorage(properties) {

        Storage.call(this, properties);
    });

LocalForageStorage.prototype.makeSetItemStream = function makeSetItemStream(upstream) {
    return upstream.flatMap(function(params) {
        return Bacon.localforage.setItem(params.path, params.data);
    });
};

LocalForageStorage.prototype.makeGetItemStream = function makeGetItemStream(upstream) {
    return upstream.map('.path').flatMap(Bacon.localforage.getItem);
};

LocalForageStorage.prototype.makeRemoveItemStream = function makeRemoveItemStream(upstream) {
    return upstream.map('.path').flatMap(Bacon.localforage.removeItem);
};

module.exports = LocalForageStorage;
