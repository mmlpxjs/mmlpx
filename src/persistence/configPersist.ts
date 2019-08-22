import { applySnapshot } from '../api/snapshot';
import persistence from './persistence';
import StorageLoader from './StorageLoader';

let persistenceDisposer: any = null;

export default function configPersist(options: any = {}) {
	const { persist = true } = options;

	if (persist) {
		const res = StorageLoader.getSnapshot();
		if (res) {
			applySnapshot(res);
		}
		persistenceDisposer = persistence();
	} else {
		if (persistenceDisposer) {
			persistenceDisposer();
		}
	}
}
