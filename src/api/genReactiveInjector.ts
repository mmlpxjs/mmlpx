/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-26 17:06
 */
import { isFunction } from 'lodash';
import { action, observable, ObservableMap } from 'mobx';
import Injector, { Entry, IContainer } from '../core/dependency-inject/Injector';

const reactiveInjectorSymbol = Symbol('reactiveInjector');

function isMapLike(duck: any) {
	return duck && isFunction(duck.set) && isFunction(duck.get) && isFunction(duck.has) && isFunction(duck.clear);
}

function getLRUCacheSymbol(container: IContainer<string, any>) {
	return Object.getOwnPropertySymbols(container).find(symbol => isMapLike((container as any)[symbol]));
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

export default function genReactiveInjector(prevInjector: Injector) {

	if ((prevInjector as any)[reactiveInjectorSymbol]) {
		return prevInjector;
	}

	let newInjector = prevInjector;

	/*
	 * if the injector has an LRUCache based container, we can hijack it and made the underlying map to be a reactive map
	 * otherwise we need to construct a reactive container
	 */
	const container: any = prevInjector.getContainer();
	const cacheSymbol = getLRUCacheSymbol(container);
	if (cacheSymbol) {

		const { reset: originalReset, dump: originalDump } = container;

		container.reset = (...args: any[]) => {
			// lru cache construct map when it resetting
			// @see https://github.com/isaacs/node-lru-cache/blob/master/index.js#L201
			originalReset.apply(container, args);
			container[cacheSymbol] = new ObservableMap();
		};

		container.dump = (...args: any[]) => {
			// :dark magic: access container map size thus snapshot will reactive with ObservableMap when its setting
			// tslint:disable-next-line
			(container[cacheSymbol].size);
			return originalDump.apply(container, args);
		};

	} else {

		const reactiveContainer = new ReactiveContainer();
		newInjector = Injector.newInstance(reactiveContainer);
	}

	const snapshot = prevInjector.dump();
	newInjector!.load(snapshot);
	(newInjector! as any)[reactiveInjectorSymbol] = true;
	return newInjector!;
}
