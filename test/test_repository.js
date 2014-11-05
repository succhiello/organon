describe('organon.repository.Repository', function() {

    var data = [{name: 'Alice', age: 12},
                {name: 'Bob', age: 24}],
        TestRepository = organon.define(organon.repository.Repository, {
            interfaceDefs: {
                add: {
                    path: '/test/add'
                },
                find: {
                    path: '/test/find'
                },
            }
        }),
        repository,
        server;

    beforeEach(function() {

        server = sinon.fakeServer.create();

        server.respondWith('GET', /\/test\/find\?id=(\d+)/, function(xhr, id) {
            xhr.respond(
                200,
                {'Content-Type': 'application/json'},
                JSON.stringify(data[id])
            );
        });

        repository = new TestRepository(new organon.storage.RESTApiStorage());
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
        expect(server.requests.length).toBe(1);
        server.respond();
    });
});
