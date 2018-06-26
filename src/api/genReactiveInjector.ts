/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-26 17:06
 */

import LRU from 'lru-cache';
import { action, observable } from 'mobx';
import Injector, { IContainer } from '../core/dependency-inject/Injector';

const reactiveInjectorSymbol = Symbol('reactiveInjector');

export default function genReactiveInjector(prevInjector: Injector) {

	if ((prevInjector as any)[reactiveInjectorSymbol]) {
		return prevInjector;
	}

	// TODO use Object.getOwnPropertySymbols to rewrite this[CacheSymbol] thus we can leverage lruCache

	class Container implements IContainer<string, any> {

		@observable
		private container = new Map<string, any>();

		@action
		set(key: string, value: any) {
			// TODO should not notify listeners
			return this.container.set(key, value);
		}

		get(key: string): any {
			return this.container.get(key);
		}

		dump(): Array<LRU.LRUEntry<string, any>> {
			return Array.from(this.container.entries()).map((entry, index) => {
				return { k: entry[0], v: entry[1], e: index };
			});
		}

		load(cacheEntries: ReadonlyArray<LRU.LRUEntry<string, any>>): void {
			this.container.clear();
			cacheEntries.forEach(entry => {
				this.container.set(entry.k, entry.v);
			});
		}
	}

	const snapshot = prevInjector.dump();
	const entries = Object.keys(snapshot).map((k, e) => {
		return {
			k,
			v: snapshot[k],
			e,
		};
	});
	const reactiveContainer = new Container();
	reactiveContainer.load(entries);
	const newInjector = Injector.newInstance(reactiveContainer);
	(newInjector as any)[reactiveInjectorSymbol] = true;
	return newInjector;
}
