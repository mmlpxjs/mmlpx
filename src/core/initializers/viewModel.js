/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import { flatten, isFunction } from 'lodash';
import invoke from '../dependency-inject/invoke';
import execPostConstruct from './execPostConstruct';

export default function initialize(ViewModel, ...args) {

	let constructorParams = args;

	// if the first argument is a function, we can initialize it with the invoker instance `this`
	if (isFunction(args[0])) {
		constructorParams = flatten([args[0].call(this)]);
	}

	const viewModel = invoke(ViewModel, { scope: 'prototype' }, ...constructorParams);

	execPostConstruct(viewModel);

	return viewModel;
}
