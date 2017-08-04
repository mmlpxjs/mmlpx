/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-04
 */

import invoker from '../core/dependency-inject/invoker';

export default ViewModel => (target, name, descriptor) => {

	if (name === void 0) {
		throw new SyntaxError('you can\'t decorate a class with viewModel decorator');
	}

	const instance = invoker(ViewModel, { scope: 'prototype' });
	descriptor.initializer = () => instance;
	descriptor.value = instance;
};
