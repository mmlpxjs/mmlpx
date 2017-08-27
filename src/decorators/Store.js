/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-12
 */

import { flatten, isFunction } from 'lodash';
import { get } from '../core/dependency-inject/container';
import { modelSymbol } from './meta';
import { incorrectAsClassDecorator } from '../utils/decorator-assert';

export const storeSymbol = Symbol('Store');

export const genInitializer = (Store, ...args) => function initializer() {

	let constructorParams = args;

	// if the first argument is a function, we can initialize it with the invoker instance `this`
	if (isFunction(args[0])) {
		constructorParams = flatten([args[0].call(this)]);
	}

	const store = get(Store, ...constructorParams);
	// create a mask-object to prevent modify original store field directly
	return Object.create(store);
};

export default (target, _, descriptor) => {

	if (descriptor !== void 0) {
		incorrectAsClassDecorator('Store');
	}

	target[modelSymbol] = storeSymbol;
};
