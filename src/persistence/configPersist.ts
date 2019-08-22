import { applySnapshot } from '../api/snapshot';
import persistence from './persistence';
import StorageLoader from './StorageLoader';

let persistenceDisposer: any = null;

interface IPtions {
	persist?: boolean;
}

export default function configPersist(options: IPtions = {}) {
	const { persist = false } = options;

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
