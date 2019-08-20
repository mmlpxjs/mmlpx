import { toJS, values } from 'mobx';
import { Snapshot } from '../core/dependency-inject/Injector';

export default class StorageLoader {
	static key = Symbol('key');

	static snapshotKey = 'mmlpx-snapshot';

	// @ts-ignore
	static snapshotStorage = window && window.localStorage;

	static saveSnapshot(snapshot: Snapshot) {
		StorageLoader.snapshotStorage.setItem(StorageLoader.snapshotKey, JSON.stringify(snapshot));
	}

	static getSnapshot(): Snapshot {
		const rs = StorageLoader.snapshotStorage.getItem(StorageLoader.snapshotKey);
		let value;
		if (rs) {
			value = JSON.parse(rs);
		} else {
			value = undefined;
		}
		console.log('%c%s', 'color: #20bd08;font-size:15px', '===TQY===: StorageLoader -> value', value, StorageLoader.snapshotKey);
		return value;
	}

	static shimLoader(snapshotStorage: any, snapshotKey = 'mmlpx-snapshot') {
		StorageLoader.snapshotStorage = snapshotStorage;
		StorageLoader.snapshotKey = snapshotKey;
	}
}
