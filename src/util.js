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

module.exports.pathToRegexp = function pathToRegexp(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
        .concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
            keys.push({ name: key, optional: !! optional });
            slash = slash || '';
            return ''
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                + (optional || '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
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
