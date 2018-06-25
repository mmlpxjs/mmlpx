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

export type InjectionOptions = {
	name?: string;
	scope: Scope;
};

export type Snapshot = {
	[propName: string]: any;
};

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
					if (!instance) {
						instance = new InjectedClass(...args);
						// only singleton injection will be stored
						container.set(name, instance);
					} else {
						// if the prototype hadn't be set
						if (Object.getPrototypeOf(instance) !== InjectedClass.prototype) {
							Object.setPrototypeOf ? Object.setPrototypeOf(instance, InjectedClass.prototype) : instance.__proto__ = InjectedClass.prototype;
						}
					}

					break;
				}

				throw new SyntaxError('A singleton injection must have a name!');

			case Scope.Prototype:
				instance = new InjectedClass(...args);
				break;

			default:
				throw new SyntaxError('You must set injected class as a mmlpx recognized model!');
		}

		return instance;
	}

	dump(): Snapshot {
		return this.container.dump().reduce((acc, entry) => ({ ...acc, [entry.k]: entry.v }), {});
	}

	load(snapshot: Snapshot) {

		const cacheArray: ReadonlyArray<LRUEntry<string, any>> = Object.keys(snapshot).map((k, e) => ({
			k,
			v: snapshot[k],
			e,
		}));

		this.container.load(cacheArray);
	}

}
