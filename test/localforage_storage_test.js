describe('organon.storage.LocalForageStorage', function() {

    var LocalForageStorage = require('../src/storage/localforage');

    localforage.config({
        name: 'organon.storage.LocalForageStorage test',
        driver: localforage.LOCALSTORAGE
    });

    it('should make set, get and remove stream', function(done) {
        var storage = new LocalForageStorage();
        storage.makeSetItemStream(Bacon.once({
            path: '/key0',
            data: {name: 'Alpha'}
        })).flatMap(function(value) {
            return storage.makeGetItemStream(Bacon.once({
                path: '/key0'
            })).map(expect).doAction('.toEqual', value);
        }).flatMap(storage.makeRemoveItemStream(Bacon.once({
            path: '/key0'
        }))).flatMap(storage.makeGetItemStream(Bacon.once({
            path: '/key0'
        }))).map(expect).doAction('.toBeNull').assign(done);
    });
});
