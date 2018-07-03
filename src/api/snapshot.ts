/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-25 17:01
 */

import { isArrayLikeObject, isFunction, mergeWith, pull } from 'lodash';
import { _getGlobalState, comparer, IReactionDisposer, reaction, runInAction } from 'mobx';
import Injector, { Snapshot } from '../core/dependency-inject/Injector';
import { getInjector, setInjector } from '../core/dependency-inject/instantiate';
import genReactiveInjector from './genReactiveInjector';

const isObject = (obj: any) => Object.prototype.toString.call(obj) === '[object Object]';
const isMap = (obj: any) => Object.prototype.toString.call(obj) === '[object Map]' ||
	(obj && isFunction(obj.entries) && isFunction(obj.get) && isFunction(obj.set));
const isArray = (obj: any) => obj && (Array.isArray(obj) || isArrayLikeObject(obj));

enum SNAPSHOT_PHASE {
	PATCHING,
	DONE,
}

let phase = SNAPSHOT_PHASE.DONE;

/**
 * serialize and walk the snapshot of injector
 * @param snapshot
 * @returns {Snapshot} serialization
 */
function serialize(snapshot: any) {

	if (isArray(snapshot)) {
		return snapshot.length ? snapshot.map((value: any) => serialize(value)) : [];
	}

	if (isMap(snapshot)) {
		if (snapshot.size) {
			const map: any = {};
			snapshot.forEach((value: any, key: string) => {
				map[key] = serialize(value);
			});
			return map;
		}
		return {};
	}

	if (isObject(snapshot)) {

		return Object.keys(snapshot).reduce((acc, stateName) => {
			acc[stateName] = serialize(snapshot[stateName]);
			return acc;
		}, {} as Snapshot);
	}

	return snapshot;
}

function processAfterReactionsFinished(processor: () => void) {
	const globalState = _getGlobalState();
	const previousDescriptor = Object.getOwnPropertyDescriptor(globalState, 'isRunningReactions');
	let prevValue: boolean = globalState.isRunningReactions;
	Object.defineProperty(globalState, 'isRunningReactions', {
		get() {
			return prevValue;
		},
		set(v: boolean) {
			prevValue = v;
			if (v === false) {
				Object.defineProperty(globalState, 'isRunningReactions', previousDescriptor!);
				processor();
			}
		},
	});
}

export function applySnapshot(snapshot: Snapshot, injector = getInjector()) {

	if (isObject(snapshot)) {
		patchSnapshot(snapshot, injector);
	}
}

export function patchSnapshot(patcher: Snapshot, injector = getInjector()) {

	const currentModels = injector.dump();

	phase = SNAPSHOT_PHASE.PATCHING;

	runInAction(() => {

		// make a copy of patcher to avoid referencing the original patcher after merge
		const clonedPatcher = JSON.parse(JSON.stringify(patcher));
		const mergedModels = mergeWith(currentModels, clonedPatcher, (original: any, source: any) => {

			// while source less than original, means the data list has items removed, so the overflowed data should be dropped
			if (isArray(original)) {
				original.length = source.length;
			}

			// while the keys of source object less than original, means some properties should be removed in original after patch
			if (isObject(original)) {
				pull(Object.keys(original), ...Object.keys(source)).forEach((key: string) => delete original[key]);
			}

			if (isMap(original)) {
				original.clear();
				Object.keys(source).forEach((key: string) => {
					original.set(key, source[key]);
				});
			}
		});

		injector.load(mergedModels);
	});

	processAfterReactionsFinished(() => phase = SNAPSHOT_PHASE.DONE);
}

export function getSnapshot(injector?: Injector): Snapshot;
export function getSnapshot(modelName: string, injector?: Injector): Snapshot;
export function getSnapshot(arg1: any, arg2?: any) {

	if (typeof arg1 === 'string') {
		const snapshot = serialize((arg2 || getInjector()).dump());
		return snapshot[arg1];
	} else {
		return serialize((arg1 || getInjector()).dump());
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
		snapshot,
		changedSnapshot => {
			// only trigger snapshot listeners when snapshot processed
			if (phase === SNAPSHOT_PHASE.DONE) {
				onChange(changedSnapshot);
			}
		},
		{ equals: comparer.structural },
	);

	return disposer;
}
