/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-25 17:01
 */

import { isObject, merge } from 'lodash';
import { comparer, IReactionDisposer, reaction } from 'mobx';
import Injector, { Snapshot } from '../core/dependency-inject/Injector';
import { getInjector, setInjector } from '../core/dependency-inject/instantiate';
import genReactiveInjector from './genReactiveInjector';

function walk(snapshot: Snapshot) {

	if (isObject(snapshot)) {

		return Object.keys(snapshot).reduce((acc, stateName) => {
			acc[stateName] = walk(snapshot[stateName]);
			return acc;
		}, {} as Snapshot);
	}

	return snapshot;
}

export function applySnapshot(snapshot: Snapshot, injector = getInjector()) {
	injector.load(snapshot);
}

export function patch(patcher: Snapshot, injector = getInjector()) {
	const currentSnapshot = getSnapshot(injector);
	const mergedSnapshot = merge(currentSnapshot, patcher);
	applySnapshot(mergedSnapshot, injector);
}

export function getSnapshot(injector?: Injector): Snapshot;
export function getSnapshot(modelName: string, injector?: Injector): Snapshot;
export function getSnapshot(arg1: any, arg2?: any) {

	if (typeof arg1 === 'string') {
		const snapshot = (arg2 || getInjector()).dump();
		return snapshot[arg1];
	} else {
		return (arg1 || getInjector()).dump();
	}
}

export function onSnapshot(onChange: (snapshot: Snapshot) => void, injector?: Injector): IReactionDisposer;
export function onSnapshot(modelName: string, onChange: (snapshot: Snapshot) => void, injector?: Injector): IReactionDisposer;
export function onSnapshot(arg1: any, arg2: any, arg3?: any) {

	let snapshot: () => Snapshot;
	let onChange: (snapshot: Snapshot) => void;
	let injector: Injector;
	if (typeof arg1 === 'string') {
		onChange = arg2;
		injector = genReactiveInjector(arg3 || getInjector());
		snapshot = () => getSnapshot(arg1, injector);
	} else {
		onChange = arg1;
		injector = genReactiveInjector(arg2 || getInjector());
		snapshot = () => getSnapshot(injector);
	}
	setInjector(injector);

	const disposer = reaction(
		() => walk(snapshot()),
		changedSnapshot => onChange(changedSnapshot),
		{ equals: comparer.structural },
	);

	return disposer;
}
