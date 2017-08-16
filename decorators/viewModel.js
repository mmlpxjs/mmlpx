/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-04
 */

import invoke from '../core/dependency-inject/invoke';

export default (ViewModel, ...args) => (target, name, descriptor) => {

	if (name === void 0) {
		throw new SyntaxError('you can\'t decorate a class with viewModel decorator');
	}

	const instance = invoke(ViewModel, { scope: 'prototype' }, ...args);
	descriptor.initializer = () => instance;
	descriptor.value = instance;
};
