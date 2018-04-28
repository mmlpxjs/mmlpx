/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import { flatten, isFunction } from 'lodash';
import Injector, { Scope } from '../Injector';
import { IMmlpx, modelNameSymbol } from '../meta';

export default function initialize<T extends IMmlpx<T>>(this: T, injector: Injector, Store: T, ...args: any[]) {

	let constructorParams = args;

	// if the first argument is a function, we can initialize it with the invoker instance `this`
	if (isFunction(args[0])) {
		constructorParams = flatten([args[0].call(this)]);
		/* istanbul ignore next */
		if (process.env.NODE_ENV !== 'production') {
			console.warn('It looks like you are use Store with a non-singleton mode, which was deprecated!!', Store.name);
		}
	}

	const name = Store[modelNameSymbol];
	const store = injector.get(Store, { scope: Scope.Singleton, name }, ...constructorParams);
	return store;
}
