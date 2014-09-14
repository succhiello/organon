namespace('Bacon.app', function(ns) {

    'use strict';

    ns.Entity = function Entity(initialValue, properties) {

        var template = _.mapValues(initialValue || {}, Bacon.Model);
        this.model = Bacon.Model.combine(template);
        _.assign(this, template);
    }

});
