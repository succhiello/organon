'use strict';

module.exports.capitalize = function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports.assignAndDefaults = function assignAndDefaults(dst, props, defaults) {
    return _.defaults(
        _.assign(dst, props || {}),
        defaults
    );
};

module.exports.define = module.exports.inherit = function define(base, derived, properties) {

    if (arguments.length < 2) {
        throw new Error('too few arguments.');
    }

    if (_.isPlainObject(derived)) {
        properties = derived;
        derived = function() { base.apply(this, arguments); };
    }

    derived.prototype = _.create(base.prototype, _.assign(properties || {}, {constructor: derived}));
    return derived;
};
