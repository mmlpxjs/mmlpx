import StorageLoader from '../StorageLoader';

test('shimLoader method of StorageLoader class should implement getSnapshot, saveSnapshot methods and custom snapshotKey', async () => {
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

	StorageLoader.shimLoader(mockLocalStorage, 'anthony');

	expect(StorageLoader.snapshotKey).toBe('anthony');

	expect(StorageLoader.getSnapshot()).toBeUndefined();
	expect(StorageLoader.saveSnapshot({ TodosStore22_1: { total22: -88, xtotal22: 0 } })).toBeUndefined();
	expect(StorageLoader.getSnapshot()).toEqual({ TodosStore22_1: { total22: -88, xtotal22: 0 } });

	expect(StorageLoader.saveSnapshot({ TodosStore: { total22: 8, xtotal22: 0 } })).toBeUndefined();
	expect(StorageLoader.getSnapshot()).toEqual({ TodosStore: { total22: 8, xtotal22: 0 } });

	StorageLoader.shimLoader(mockLocalStorage, 'anthony-storage');
	expect(StorageLoader.snapshotKey).toBe('anthony-storage');
	expect(StorageLoader.getSnapshot()).toBeUndefined();
});
