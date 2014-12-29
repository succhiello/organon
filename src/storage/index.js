'use strict';

var Storage = function Storage(properties) {
        _.assign(this, properties || {});
        this.notImplemented = new Bacon.constant(new Bacon.Error('not implemented.'));
    };

Storage.prototype.makeSetItemStream = function makeSetItemStream(upstream) {
    return this.notImplemented;
};

Storage.prototype.makeGetItemStream = function makeGetItemStream(upstream) {
    return this.notImplemented;
};

Storage.prototype.makeRemoveItemStream = function makeRemoveItemStream(upstream) {
    return this.notImplemented;
};

module.exports = Storage;
