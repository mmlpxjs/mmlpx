/**
 * @author anthony
 * @homepage https://github.com/anthony/
 * @since 2018-08-24 11:30
 */
import { action, observable } from 'mobx';
import { ViewModelBase } from '../..';
import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';

test('undo method based ViewModelBase class should back to prev snapshot; redo method should forward to next snapshot', async () => {
	@Store('StoreClass')
	class StoreClass {
		@observable name = 'anthony';

		@action update() {
			this.name = 'anthony tank';
		}

		@action
		async asyncUpdate(name: string) {
			await name;
			this.name = name;
		}

		getName() {
			return this.name;
		}
	}

	class ViewModel extends ViewModelBase {
		@inject() store: StoreClass;
	}

	const vm = new ViewModel();
	expect(vm.store.name).toBe('anthony');
	const disposer = vm.enableRedoUndo();

	expect(vm.store.update()).toBeUndefined();

	expect(vm.store.name).toBe('anthony tank');

	expect(vm.store.getName()).toBe(vm.store.name);

	expect(await vm.store.asyncUpdate('async')).toBeUndefined();
	expect(vm.store.name).toBe('async');

	vm.undo();

	expect(vm.store.name).toBe('anthony tank');

	vm.undo();
	expect(vm.store.name).toBe('anthony');
	expect(vm.store.getName()).toBe(vm.store.name);

	vm.undo();
	vm.undo();
	vm.undo();
	vm.undo();
	vm.undo();
	expect(vm.store.name).toBe('anthony');
	vm.redo();
	expect(vm.store.name).toBe('anthony tank');

	vm.redo();
	expect(vm.store.name).toBe('async');

	vm.redo();
	vm.redo();
	vm.redo();
	vm.redo();
	vm.redo();
	vm.redo();
	expect(vm.store.name).toBe('async');

	disposer();
});
