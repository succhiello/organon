describe('organon.util', function() {

    var util = require('../src/util');

    describe('capitalize', function() {
        it('should do capitalize', function() {
            expect(util.capitalize('capitalized')).toBe('Capitalized');
        });
    });

    describe('assignAndDefaults', function() {
        it('should assign attribute', function() {
            var obj = {};
            util.assignAndDefaults(obj, {a: 0});
            expect(obj.a).toBe(0);
        });
        it('should set default attribute', function() {
            var obj = {a: 0};
            util.assignAndDefaults(obj, {b: 1}, {b: -1, c: 2});
            expect(obj).toEqual({a: 0, b: 1, c: 2});
        });
    });
});
