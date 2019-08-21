import { applySnapshot } from '..';
import persistence from '../loader/persistence';
import StorageLoader from '../loader/storageLoader';

const sleep = (delay: number = 0) => {
	return new Promise(resolve => {
		setTimeout(() => {
			resolve();
		}, delay);
	});
};

export async function init(options: any = {}) {
	const { persist = true, StorageLoader: StorageLoader2 } = options;

	if (persist) {
		const res = StorageLoader.getSnapshot();
		if (res) {
			applySnapshot(res);
		}
		await sleep();

		persistence();
	}
}
