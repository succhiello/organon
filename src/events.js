'use strict';

var Events = function Events(properties) {

    var self = this,
        events = (properties.events || self.events) || {};

    self._unsubscriber = new Bacon.Bus();

    self._unsubscriber.onValue(function() {
        delete self.ev;
        self.ev = _.mapValues(events, function(eventThunk) {
            return eventThunk.call(self).takeUntil(self._unsubscriber);
        });
    });
};

Events.prototype.resetEvent = function resetEvent() {
    this._unsubscriber.push();
};

module.exports = Events;
