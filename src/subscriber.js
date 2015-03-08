'use strict';

module.exports = function Subscriber(properties) {

    properties = _.defaults(properties || {}, {
        subscription: this.subscription || {}
    });

    this.listenTo = function(name, publisher) {
        var subscription = properties.subscription[name];
        if (_.isUndefined(subscription)) {
            throw new Error('subscription "' + name + '" not found.');
        }
        return subscription.call(this, publisher.on$);
    };
};
