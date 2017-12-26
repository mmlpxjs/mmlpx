/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import { flatten, isFunction } from 'lodash';
import Injector, { Scope } from '../Injector';
import { modelNameSymbol } from '../meta';
import execPostConstruct from './execPostConstruct';

export default function initialize<T>(this: any, injector: Injector, ViewModel: any, ...args: any[]) {

	let constructorParams = args;

	// if the first argument is a function, we can initialize it with the invoker instance `this`
	if (isFunction(args[0])) {
		constructorParams = flatten([args[0].call(this)]);
	}

	const name = ViewModel[modelNameSymbol];
	const viewModel = injector.get<T>(ViewModel, { scope: Scope.Request, name }, ...constructorParams);

	execPostConstruct(viewModel);

	return viewModel;
}
