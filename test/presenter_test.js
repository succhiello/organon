describe('organon.presenter.Presenter', function() {

    var presenter, server,
        organon = require('../src');

    organon.run({});
    var initialViewModel = {
                items: [],
                currentItemId: -1
            };

    beforeEach(function() {

        presenter = new organon.presenter.Presenter(organon.app(), {
            initialViewModel: initialViewModel,
            busDefs: {
                addItem: function(vm, item) {
                    vm.items.push(item);
                    return vm;
                },
                setCurrentItemId: function(vm, id) {
                    vm.currentItemId = id;
                    return vm;
                },
                nop: function(vm) {
                    return vm;
                }
            },
            initialize: function() {
                this.currentItem = this.viewModel.map(function(vm) {
                    return vm.currentItemId === -1 ? null : vm.items[vm.currentItemId];
                });
            }
        });
    });

    it('should be update viewModel whenever bus is pushed', function(done) {
        presenter.viewModel.map('.items.length').map(expect).doAction('.toBe', 0).assign(done);
        presenter.bus.setCurrentItemId.push(0);
    });

    it('should fire "viewModelChanges" stream only when viewModel changes', function(done) {

        presenter.viewModelChanges().map('.items.length').map(expect).doAction('.toBe', 1).assign(done);

        presenter.bus.nop.push();  // stream not will be fired
        presenter.bus.addItem.push({name: 'Alice', age: 12});  // stream will be fired
    });

    it('should fire mapped "viewModelChanges" stream only when mapped property changes', function(done) {

        presenter.viewModelChanges('.currentItemId').map(expect).doAction('.toBe', 0).assign(done);

        presenter.bus.nop.push();  // stream not will be fired
        presenter.bus.addItem.push({name: 'Alice', age: 12});  // stream will not be fired
        presenter.bus.setCurrentItemId.push(0);  // stream will be fired
    });
});
