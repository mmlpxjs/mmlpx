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
	console.log('%c%s', 'color: #20bd08;font-size:15px', '===TQY===: init -> StorageLoader2', StorageLoader2.key == StorageLoader.key);

	if (persist) {
		const res = StorageLoader.getSnapshot();
		console.log('%c%s', 'color: #20bd08;font-size:15px', '===TQY===: init initinitinitinitinit -> StorageLoader', StorageLoader.snapshotKey);
		console.log('%c%s', 'color: #20bd08;font-size:15px', '===TQY===: init -> res', res);
		if (res) {
			applySnapshot(res);
		}
		await sleep();
		console.log('%c%s', 'color: #20bd08;font-size:15px', '===TQY===: init -> sleep');

		persistence();
	}
}
