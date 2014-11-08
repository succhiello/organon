namespace('organon.util', function(ns) {

    'use strict';

    ns.capitalize = function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    ns.assignAndDefaults = function assignAndDefaults(dst, props, defaults) {
        return _.defaults(
            _.assign(dst, props || {}),
            defaults
        );
    };

    ns.pathToRegexp = function pathToRegexp(path, keys, sensitive, strict) {
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
});
