/**
 * @author anthony
 * @homepage https://github.com/anthony/
 * @since 2018-08-24 11:30
 */
import { action, observable } from 'mobx';
import { init, ViewModelBase } from '../..';
import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';

import StorageLoader from '../../loader/StorageLoader';

test('undo method based ViewModelBase class should back to prev snapshot; redo method should forward to next snapshot', async () => {
	const mockStoragePool: { [propName: string]: any } = { anthony: { StoreClass: { name: 'tank' } } };
	const mockLocalStorage = {
		setItem: (key: string, value: string) => {
			mockStoragePool[key] = value;
		},
		getItem: (key: string) => {
			const value = mockStoragePool[key];
			return value;
		},
	};

	StorageLoader.shimLoader(mockLocalStorage, 'anthony');
	expect(StorageLoader.snapshotKey).toBe('anthony');
	// expect(mockLocalStorage.getItem('anthony')).toEqual({ StoreClass: { name: 'tank' } });
	await init({ StorageLoader });
	// expect(mockLocalStorage.getItem('anthony')).toEqual({ StoreClass: { name: 'tank' } });

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

	expect(vm.store.name).toBe('anthony');
});
