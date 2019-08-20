import { onSnapshot } from '..';
import StorageLoader from './StorageLoader';

export default function persistence() {
	return onSnapshot(snapshot => {
		StorageLoader.saveSnapshot(snapshot);
	});
}
