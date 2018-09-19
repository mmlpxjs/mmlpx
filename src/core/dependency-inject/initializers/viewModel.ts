/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import { flatten, isFunction } from 'lodash';
import Injector, { Scope } from '../Injector';
import { IMmlpx, modelNameSymbol } from '../meta';

export default function initialize<T extends IMmlpx<T>>(this: T, injector: Injector, ViewModel: T, ...args: any[]) {

	let constructorParams = args;

	// if the first argument is a function, we can initialize it with the invoker instance `this`
	if (isFunction(args[0])) {
		constructorParams = flatten([args[0].call(this, this)]);
	}

	const name = ViewModel[modelNameSymbol];

	return injector.get(ViewModel, { scope: Scope.Prototype, name }, ...constructorParams);
}
