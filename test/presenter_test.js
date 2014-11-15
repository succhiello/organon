jasmine.DEFAULT_TIMEOUT_INTERVAL = 500;

describe('organon.presenter.Presenter', function() {

    var presenter, server,
        organon = require('../src/main');

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

    it('should be update viewModel whenever bus is pushed', function() {

        var lengthIsToBeChanged = false;

        presenter.viewModel.onValue(function(vm) {

            if (lengthIsToBeChanged) {
                expect(vm.items.length).toBe(1);
            } else {
                expect(vm.items.length).toBe(0);
            }
        });

        presenter.bus.setCurrentItemId.push(0);
        lengthIsToBeChanged = true;
        presenter.bus.addItem.push({name: 'Alice', age: 12});
    });

    it('should fire "viewModelChanges" stream only when viewModel changes', function() {

        presenter.viewModelChanges().onValue(function(vm) {
            expect(vm.items.length).toBe(1);
        });

        presenter.bus.nop.push();  // stream not will be fired
        presenter.bus.addItem.push({name: 'Alice', age: 12});  // stream will be fired
    });

    it('should fire mapped "viewModelChanges" stream only when mapped property changes', function() {

        presenter.viewModelChanges('.currentItemId').onValue(function(id) {
            expect(id).toBe(0);
        });

        presenter.bus.nop.push();  // stream not will be fired
        presenter.bus.addItem.push({name: 'Alice', age: 12});  // stream will not be fired
        presenter.bus.setCurrentItemId.push(0);  // stream will be fired
    });
});
