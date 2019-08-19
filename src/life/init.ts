import { applySnapshot } from '..';
import persistence from '../loader/persistence';
import { StorageLoader } from '../loader/storageLoader';

export function init(options: any = {}) {
	const { persist = true } = options;
	if (persist) {
		applySnapshot(StorageLoader.getSnapshot());

		setTimeout(() => {
			persistence();
		}, 0);
	}
}
