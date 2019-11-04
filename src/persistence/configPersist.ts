import { IReactionDisposer } from 'mobx';
import { applySnapshot } from '../api/snapshot';
import persistence from './persistence';
import StorageLoader from './StorageLoader';

let persistenceDisposer: IReactionDisposer;

interface IPtions {
	persist?: boolean;
}

// it should be excuted after injector container initializing, for instance, involved in async task queue
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
