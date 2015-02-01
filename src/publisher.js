'use strict';

module.exports = function Publisher(properties, refresher$, unsubscriber$) {

    var self = this;

    properties = _.defaults(properties || {}, {
        on: self.on || {}
    });

    if (!refresher$) {
        refresher$ = Bacon.once();
    }

    self.on$ = _.mapValues(properties.on, function(f, name) {

        var stream = refresher$.flatMap(function(arg) {
            var s = f.call(self, arg);
            return unsubscriber$ ? s.takeUntil(unsubscriber$) : s;
        });

        if (properties.debug) {
            stream.log('organon.Publisher[' + (properties.name ? properties.name : '') + '].on$.' + name);
        }

        return stream;
    });
};
