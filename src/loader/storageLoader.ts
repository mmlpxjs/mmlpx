import { Snapshot } from '../core/dependency-inject/Injector';

// @ts-ignore
let usedStorage = window && window.localStorage;

let usedSnapshotKey = 'mmlpx-snapshot';

export default function shimLoader(storage: any, snapshotKey = 'mmlpx-snapshot') {
	usedStorage = storage;
	usedSnapshotKey = snapshotKey;
}

export class StorageLoader {
	static readonly snapshotKey = usedSnapshotKey;

	static saveSnapshot(snapshot: Snapshot) {
		usedStorage.setItem(StorageLoader.snapshotKey, JSON.stringify(snapshot));
	}

	static getSnapshot(): Snapshot {
		let rs;

		try {
			rs = JSON.parse(usedStorage.getItem(StorageLoader.snapshotKey)!);
		} catch (error) {}

		return rs;
	}
}
