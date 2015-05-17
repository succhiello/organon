'use strict';

module.exports = function Subscriber(properties) {

    var self = this;

    properties = _.defaults(properties || {}, {
        subscription: self.subscription || {}
    });

    this.listenTo = function(name, publisher) {
        var subscription = properties.subscription[name];
        if (_.isFunction(subscription)) {
            subscription.call(self, publisher.on$, publisher.prop$);
        }
    };
};
