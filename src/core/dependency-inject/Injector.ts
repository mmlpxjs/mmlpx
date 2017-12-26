/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017/12/25
 */

import * as LRUCache from 'lru-cache';
import { LRUEntry } from 'lru-cache';
import { v4 } from 'uuid';
import { modelNameSymbol } from './meta';

export const enum Scope {
	Singleton = 'singleton',
	Request = 'request',
}

export interface InjectionOptions {
	name?: string;
	scope?: Scope;
}

export interface ISnapshot {
	[propName: string]: any;
}

export interface IContainer<K, V> {

	set(key: K, value: V, maxAge?: number): boolean;

	get(key: K): V | undefined;

	dump(): Array<LRUEntry<K, V>>;

	load(cacheEntries: ReadonlyArray<LRUEntry<K, V>>): void;
}

export default class Injector {

	static singleton: Injector | null = null;
	private container: IContainer<string, any> = new LRUCache<string, any>();

	private constructor(container?: IContainer<string, any>) {
		this.container = container || new LRUCache<string, any>();
	}

	static newInstance(container?: IContainer<string, any>) {
		return new Injector(container);
	}

	static getDefaultInjector() {
		return Injector.singleton || (Injector.singleton = new Injector());
	}

	get<T>(InjectedClass: any, options: InjectionOptions, ...args: any[]): T {

		const { scope = Scope.Request, name = InjectedClass[modelNameSymbol] || v4() } = options;
		const { container } = this;

		let instance = null;

		switch (scope) {

			case Scope.Singleton:

				instance = container.get(name);
				if (instance === undefined) {
					instance = new InjectedClass(...args);
					// set injected class model name for next getting
					InjectedClass[modelNameSymbol] = name;
				}

				break;

			default:
				instance = new InjectedClass(...args);
				break;
		}

		container.set(name, instance);

		return instance;
	}

	dump(): ISnapshot {
		return this.container.dump().reduce((acc, entry) => ({ ...acc, [entry.k]: entry.v }), {});
	}

	load(snapshot: ISnapshot) {

		const cacheArray: ReadonlyArray<LRUEntry<string, any>> = Object.keys(snapshot).map((k, e) => ({
			k,
			v: snapshot[k],
			e,
		}));

		this.container.load(cacheArray);
	}

}
