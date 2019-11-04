import { IReactionDisposer } from 'mobx';
import { onSnapshot } from '../api/snapshot';
import StorageLoader from './StorageLoader';

export default function persistence(): IReactionDisposer {
	return onSnapshot(snapshot => {
		StorageLoader.saveSnapshot(snapshot);
	});
}
