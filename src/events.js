'use strict';

var Events = function Events(properties) {

    var self = this,
        events = (properties.events || self.events) || {};

    self._unsubscriber = new Bacon.Bus();

    self._unsubscriber.onValue(function() {
        console.log(self.name + ' reset');
        delete self.ev;
        self.ev = _.mapValues(events, function(eventThunk, k) {
            var stream = eventThunk.call(self).takeUntil(self._unsubscriber);
            stream.onEnd(function() {console.log(k);});
            return stream;
        });
    });
};

Events.prototype.resetEvent = function resetEvent() {
    this._unsubscriber.push();
};

module.exports = Events;
