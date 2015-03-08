'use strict';

module.exports = function Subscriber(properties) {

    properties = _.defaults(properties || {}, {
        subscription: this.subscription || {}
    });

    this.listenTo = function(name, publisher) {
        var subscription = properties.subscription[name];
        if (_.isFunction(subscription)) {
            subscription.call(this, publisher.on$);
        } else {
            console.error('invalid subscription "' + name + '".');
        }
    };
};
