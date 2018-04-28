/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017/12/25
 */

import LRUCache, { LRUEntry } from 'lru-cache';
import { Constructor } from './meta';

export const enum Scope {
	Singleton = 'singleton',
	Prototype = 'prototype',
}

export interface InjectionOptions {
	name?: string;
	scope: Scope;
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

	private container: IContainer<string, any> = new LRUCache<string, any>();

	private constructor(container?: IContainer<string, any>) {
		this.container = container || new LRUCache<string, any>();
	}

	static newInstance(container?: IContainer<string, any>) {
		return new Injector(container);
	}

	get<T>(InjectedClass: Constructor<T>, options: InjectionOptions, ...args: any[]): T {

		const { scope, name } = options;
		const { container } = this;

		let instance;

		switch (scope) {

			case Scope.Singleton:

				if (name) {

					instance = container.get(name);
					if (instance === undefined) {
						instance = new InjectedClass(...args);
					}

					// only singleton injection will be stored
					container.set(name, instance);
					break;
				}

				throw new SyntaxError('A singleton injection must have a name!');

			case Scope.Prototype:
				instance = new InjectedClass(...args);
				break;
		}

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
