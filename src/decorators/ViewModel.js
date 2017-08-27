/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-04
 */

import { flatten, isFunction } from 'lodash';
import invoke from '../core/dependency-inject/invoke';
import { modelSymbol } from './meta';
import { incorrectAsClassDecorator } from '../utils/decorator-assert';
import { execPostConstruct } from './postConstruct';

export const viewModelSymbol = Symbol('viewModel');

export const genInitializer = (ViewModel, ...args) => function initializer() {

	let constructorParams = args;

	// if the first argument is a function, we can initialize it with the invoker instance `this`
	if (isFunction(args[0])) {
		constructorParams = flatten([args[0].call(this)]);
	}

	const viewModel = invoke(ViewModel, { scope: 'prototype' }, ...constructorParams);

	execPostConstruct(viewModel);

	return viewModel;
};

export default (target, _, descriptor) => {

	if (descriptor !== void 0) {
		incorrectAsClassDecorator('Store');
	}

	target[modelSymbol] = viewModelSymbol;
};
