jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

describe('organon.repository.Repository', function() {

    var define = require('../src/util').define,
        Repository = require('../src/repository'),
        RESTApiStorage = require('../src/storage/restapi');

    var data = [{id: 0, name: 'Alice', age: 12},
                {id: 1, name: 'Bob', age: 24}],
        TestRepository = define(Repository, {
            interfaceDefs: {
                add: {
                    path: '/test/add'
                },
                find: {
                    path: '/test/find'
                },
                getNumData: {
                    type: 'get',
                    path: '/test/numData'
                },
                get: {
                    type: 'get',
                    path: '/test/get/:id'
                },
            }
        }),
        repository,
        server;

    Repository.defineInterface(TestRepository, 'getNumData');
    Repository.defineInterface(TestRepository, 'get');

    beforeEach(function() {

        server = sinon.fakeServer.create();

        server.respondWith('GET', /\/test\/find\?id=(\d+)/, function(xhr, id) {
            xhr.respond(
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(data[id])
            );
        });

        server.respondWith('POST', '/test/add', function(xhr) {
            var added = JSON.parse(xhr.requestBody);
            added.id = data.length;
            data.push(added);
            xhr.respond(
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(added)
            );
        });

        server.respondWith('GET', '/test/numData', [
            200,
            {'Content-Type': 'application/json'},
            JSON.stringify({numData: data.length})
        ]);

        server.respondWith('GET', /\/test\/get\/(\d+)/, function(xhr, id) {
            xhr.respond(
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(data[id])
            );
        });

        server.autoRespond = true;

        repository = new TestRepository(new RESTApiStorage());
    });

    afterEach(function() {
        server.restore();
    });

    it('should find instance', function(done) {

        repository.sink.find.onValue(function(result) {
            expect(result).toEqual(data[0]);
            done();
        });

        repository.find({id: 0});
    });

    it('should add instance', function(done) {

        repository.sink.add.onValue(function(result) {
            expect(result.name).toBe('Charlie');
            expect(result.age).toBe(36);
            done();
        });

        repository.add({name: 'Charlie', age: 36});
    });

    it('should support custome interface', function(done) {

        Bacon.zipWith([repository.sink.add, repository.sink.getNumData], function(added, numData) {
            expect(added.id).toBe(numData.numData);
        }).assign(done);

        repository.sink.add.onValue(function(result) {
            repository.getNumData();
        });

        repository.add({name: 'Doe', age: 48});
    });

    it('should interpolate path includes colon with params, and eliminate used keys and values', function(done) {

        repository.sink.get.onValue(function(result) {
            expect(result).toEqual(data[0]);
            done();
        });

        repository.get({id: 0});
    });
});
