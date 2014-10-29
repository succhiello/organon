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
});
