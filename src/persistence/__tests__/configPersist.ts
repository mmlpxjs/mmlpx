import { action, observable } from 'mobx';

import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';

import ViewModelBase from '../../base/ViewModel';
import configPersist from '../configPersist';
import StorageLoader from '../StorageLoader';

const mockStoragePool: { [propName: string]: any } = { 'mmlpx-snapshot': '{"StoreClass": {"name": "tank"}}' };
const mockLocalStorage = {
	setItem: (key: string, value: string) => {
		mockStoragePool[key] = value;
	},
	getItem: (key: string) => {
		const value = mockStoragePool[key];
		return value;
	},
};
StorageLoader.shimLoader(mockLocalStorage);

test('persist of configPersist should enable or disable persisting', async () => {
	@Store('StoreClass')
	class StoreClass {
		@observable name = 'anthony';

		@action update(name: string) {
			this.name = name;
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
	expect(vm.store.name).toBe('anthony');

	configPersist();

	expect(vm.store.name).toBe('tank');

	vm.store.update('anthony tank');
	expect(vm.store.name).toBe('anthony tank');

	expect(StorageLoader.getSnapshot()).toEqual({ StoreClass: { name: 'anthony tank' } });

	vm.store.update('...');
	expect(vm.store.name).toBe('...');
	expect(StorageLoader.getSnapshot()).toEqual({ StoreClass: { name: '...' } });

	configPersist({ persist: false, StorageLoader });

	vm.store.update('test');
	expect(vm.store.name).toBe('test');
	expect(StorageLoader.getSnapshot()).toEqual({ StoreClass: { name: '...' } });

	vm.store.update('tack anthony');
	expect(vm.store.name).toBe('tack anthony');
	expect(StorageLoader.getSnapshot()).toEqual({ StoreClass: { name: '...' } });
});
