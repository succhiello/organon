'use strict';

var Events = function Events(properties) {

    var self = this,
        events = (properties.events || self.events) || {},
        debug = properties.debug || false;

    self._unsubscriber = new Bacon.Bus();

    self._unsubscriber.onValue(function(arg) {
        delete self.ev;
        self.ev = _.mapValues(events, function(thunk, name) {
            var stream = thunk.call(self, arg).takeUntil(self._unsubscriber);
            if (debug) {
                stream.log('organon.events.' + (properties.name ? properties.name + '.' : '') + name);
            }
            return stream;
        });
    });
};

Events.prototype.resetEvent = function resetEvent(arg) {
    this._unsubscriber.push(arg);
};

module.exports = Events;
