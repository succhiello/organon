'use strict';

module.exports = function Publisher(config, refresher$, unsubscriber$) {

    var self = this;

    config = _.defaults(config || {}, {
        on: self.on || {},
        prop: self.prop || {}
    });

    if (!refresher$) {
        refresher$ = Bacon.constant();
    }

    this.on$ = _.defaults(
        _.mapValues(config.on, _.bind(_makeStream, this, false, config, refresher$, unsubscriber$)),
        this.on$
    );

    this.prop$ = _.defaults(
        _.mapValues(config.prop, _.bind(_makeStream, this, true, config, refresher$, unsubscriber$)),
        this.prop$
    );
};

function _makeStream(isProp, config, refresher$, unsubscriber$, value, name) {

    var self = this,
        f = null,
        initialValue = null,
        initialValueExists = false,
        stream = null;

    if (isProp) {
        if (_.isArray(value)) {
            if (value.length !== 2) {
                throw new Error('invalid prop definition "' + value + '".');
            }
            initialValue = value[0];
            initialValueExists = true;
            f = value[1];
        } else {
            f = value;
        }
    } else {
        f = value;
    }

    stream = refresher$.flatMap(function(arg) {
        var s = f.call(self, arg);
        return unsubscriber$ ? s.takeUntil(unsubscriber$) : s;
    });

    if (isProp) {
        stream = initialValueExists ? stream.toProperty(initialValue) : stream.toProperty();
    }

    return config.debug ? stream.doLog(
        'organon.Publisher[' + (config.name ? config.name : '') + '].' + (isProp ? 'prop' : 'on') + '$.' + name
    ) : stream;
}
