import { action, observable } from 'mobx';

import ViewModelBase from '../../base/ViewModel';
import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';
import persistence from '../persistence';
import StorageLoader from '../StorageLoader';
const mockStoragePool: { [propName: string]: any } = {};
const mockLocalStorage = {
	setItem: (key: string, value: string) => {
		mockStoragePool[key] = value;
	},
	getItem: (key: string) => {
		const value = mockStoragePool[key];
		return value;
	},
};

StorageLoader.shimLoader(mockLocalStorage, 'anthony-storage');

test('persistence should enable snapshot persisting', async () => {
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
	}

	class ViewModel extends ViewModelBase {
		@inject() store: StoreClass;
	}

	const vm = new ViewModel();
	const persistenceDisposer = persistence();

	expect(vm.store.name).toBe('anthony');
	const disposer = vm.enableRedoUndo();

	expect(vm.store.update()).toBeUndefined();
	expect(vm.store.name).toBe('anthony tank');
	expect(StorageLoader.getSnapshot()).toEqual({ StoreClass: { name: 'anthony tank' } });

	expect(await vm.store.asyncUpdate('async')).toBeUndefined();
	expect(vm.store.name).toBe('async');
	expect(StorageLoader.getSnapshot()).toEqual({ StoreClass: { name: 'async' } });

	vm.undo();
	expect(vm.store.name).toBe('anthony tank');
	expect(StorageLoader.getSnapshot()).toEqual({ StoreClass: { name: 'async' } });

	vm.undo();
	vm.undo();
	vm.undo();
	vm.undo();
	vm.undo();
	expect(vm.store.name).toBe('anthony');
	expect(StorageLoader.getSnapshot()).toEqual({ StoreClass: { name: 'async' } });

	vm.redo();
	vm.redo();
	vm.redo();
	vm.redo();
	vm.redo();
	vm.redo();
	expect(vm.store.name).toBe('async');
	expect(StorageLoader.getSnapshot()).toEqual({ StoreClass: { name: 'async' } });

	disposer();
	persistenceDisposer();
});
