/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-26 17:06
 */
import { action, observable, ObservableMap, runInAction } from 'mobx';
import Injector, { Entry, IContainer } from '../core/dependency-inject/Injector';
import { isMap } from '../utils/types';

const reactiveInjectorSymbol = Symbol('reactiveInjector');

interface IReactiveInjector extends Injector {
	[reactiveInjectorSymbol]: boolean;
}

function getLRUCacheSymbol(container: IContainer<string, any>) {
	return Object.getOwnPropertySymbols(container).find(symbol => isMap((container as any)[symbol]));
}

class ReactiveContainer implements IContainer<string, any> {

	@observable
	private container = new Map<string, any>();

	@action
	set(key: string, value: any) {
		try {
			this.container.set(key, value);
			return true;
		} catch (e) {
			console.error(e);
			return false;
		}
	}

	get(key: string): any {
		return this.container.get(key);
	}

	dump() {
		return Array.from(this.container.entries()).map(entry => {
			return { k: entry[0], v: entry[1] };
		});
	}

	@action
	load(cacheEntries: ReadonlyArray<Entry<string, any>>): void {
		this.container.clear();
		cacheEntries.forEach(entry => {
			this.container.set(entry.k, entry.v);
		});
	}
}

export default function genReactiveInjector(prevInjector: IReactiveInjector) {

	if (prevInjector[reactiveInjectorSymbol]) {
		return prevInjector;
	}

	let newInjector = prevInjector;

	/*
	 * if the injector has an LRUCache based container, we can hijack it and made the underlying map to be a reactive map,
	 * and keep the lru features
	 * otherwise we need to construct a simple-ObservableMap-based reactive container
	 */
	const container: any = prevInjector.getContainer();
	const cacheSymbol = getLRUCacheSymbol(container);
	if (cacheSymbol) {

		const { dump: originalDump, set: originalSet } = container;

		const originalMap = container[cacheSymbol];
		const observableMap = originalMap instanceof ObservableMap ? originalMap : new ObservableMap();
		// hijack the map assignment to replace it by a ObservableMap
		// @see https://github.com/isaacs/node-lru-cache/blob/master/index.js#L201
		Object.defineProperty(container, cacheSymbol, {
			set() {
				// should clear the map rather than reassign it to a new one, what will lose the reactive observation
				runInAction(() => observableMap.clear());
			},
			get() {
				return observableMap;
			},
		});

		// wrap observable map setting into action
		container.set = (...args: any[]) => {
			let result = false;
			runInAction(() => result = originalSet.apply(container, args));
			return result;
		};

		container.dump = (...args: any[]) => {
			// :dark magic: access container map size thus snapshot will reactive with ObservableMap when its setting(via getSnapshot invocation)
			// tslint:disable-next-line
			(container[cacheSymbol].size);
			return originalDump.apply(container, args);
		};

	} else {

		const reactiveContainer = new ReactiveContainer();
		newInjector = Injector.newInstance(reactiveContainer) as IReactiveInjector;
	}

	const snapshot = prevInjector.dump();
	newInjector.load(snapshot);
	newInjector[reactiveInjectorSymbol] = true;
	return newInjector!;
}
