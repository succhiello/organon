'use strict';

function AppData(initial) {

    if (initial instanceof Bacon.Property) {
        this.$ = initial;
        initial = initial.get();
    } else if(_.isPlainObject(initial)) {
        this.$ = Bacon.Model(_.clone(initial, true));
    } else {
        throw new Error('invalid initial value');
    }

    // if initial is scalar value, will be just ignored.
    _.forEach(initial, function(v, k) {
        if (_.isArray(v) || _.isPlainObject(v)) {
            this[k] = new AppData(this.$.lens(k + ''));
        }
    }, this);
}

AppData.prototype.get = function get() {
    return this.$.get();
};

AppData.prototype.set = function set(v) {
    return this.$.set(v);
};

AppData.prototype.changes = function changes() {
    return this.$.skipDuplicates(_.isEqual).changes();
};

AppData.prototype.addModifier = function addModifier(modifier, f) {
    return this.$.apply(modifier.map(function(m) {
        return function(v) {
            return f(_.clone(v, true), m);
        };
    }));
};

module.exports = AppData;
