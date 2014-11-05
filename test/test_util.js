describe('organon.util', function() {

    describe('capitalize', function() {
        it('should do capitalize', function() {
            expect(organon.util.capitalize('capitalized')).toBe('Capitalized');
        });
    });

    describe('assignAndDefaults', function() {
        it('should assign attribute', function() {
            var obj = {};
            organon.util.assignAndDefaults(obj, {a: 0});
            expect(obj.a).toBe(0);
        });
        it('should set default attribute', function() {
            var obj = {a: 0};
            organon.util.assignAndDefaults(obj, {b: 1}, {b: -1, c: 2});
            expect(obj).toEqual({a: 0, b: 1, c: 2});
        });
    });
});
