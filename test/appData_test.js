describe('AppData', function() {

    var AppData = require('../src/appData'),
        initial = {
            alpha: 0,
            bravo: 1,
            charlie: 2
        }, changed = {
            alpha: 'a',
            bravo: 'b',
            charlie: 'c'
        }, hierarchical = {
            alpha: {
                one: 1,
                two: 2
            },
            bravo: {
                one: 1,
                two: 2,
                three: 3
            }
        };

    it('should create with initial data and get data', function() {
        expect(new AppData(initial).get()).toEqual(initial);
    });

    it('should set data and has Bacon.Model instance "$"', function(done) {
        var data = new AppData(initial);
        data.$.changes().map(expect).doAction('.toEqual', changed).assign(done);
        data.set(changed);
    });

    it('should support deep comparison check by "changes" method', function(done) {

        var data = new AppData(initial);

        Bacon.zipAsArray(
            // occured by 1st set
            data.$.changes().map(expect).doAction('.toEqual', initial).map(true).take(1),
            // occured by 2nd set and not by 1st, because AppData.changes() does deep comparison check
            data.changes().map(expect).doAction('.toEqual', changed).map(true)
        ).map(expect).doAction('.toEqual', [true, true]).assign(done);

        data.set(_.clone(initial));
        data.set(changed);
    });

    it('should support incremental modification by "modify" method', function(done) {

        var data = new AppData(initial),
            bus = new Bacon.Bus();

        data.addModifier(bus, function(prev, v) {
            prev['delta'] = v;
            return prev;
        });

        data.changes()
            .map(expect)
            .doAction('.toEqual', _.assign(_.clone(initial), {delta: 3}))
            .assign(done);

        bus.push(3);
    });

    it('should create AppData hierarchy and Bacon.Model hierarchy automatically', function(done) {

        // pass hierarchical data as initial data
        var data = new AppData(hierarchical);

        // data.alpha is also AppData too
        expect(data.alpha.get()).toEqual({one: 1, two: 2});

        // child AppData has "lens"ed Bacon.Model
        data.bravo.$.map(expect).assign('.toEqual', hierarchical.bravo);

        // data.set (not "data.alpha.set") affect data.alpha.$, because data.alpha.$ is "lens"ed Bacon.Model
        data.alpha.changes().map(expect).doAction('.toEqual', hierarchical.bravo).assign(done);

        data.set({
            alpha: {
                one: 1,
                two: 2,
                three: 3
            },
            bravo: {
                one: 1,
                two: 2,
                three: 3
            }
        });
    });
});
