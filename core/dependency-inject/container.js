/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-12
 */

import LRUCache from 'lru-cache';
import { v4 } from 'uuid';

const instanceSymbol = Symbol('injection');

const container = new LRUCache();

export const get = InjectedClass => {

	let instance = null;

	if (!InjectedClass[instanceSymbol]) {

		instance = new InjectedClass();

		// set symbol
		const uuid = v4();
		container.set(uuid, instance);
		InjectedClass[instanceSymbol] = uuid;

	} else {
		instance = container.get(InjectedClass[instanceSymbol]);
	}

	return instance;

};
