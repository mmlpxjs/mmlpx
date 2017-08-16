/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */

import invoke from '../core/dependency-inject/invoke';

export default (InjectedClass, opts = { scope: 'singleton' }, ...args) => (target, name, descriptor) => {

	if (name === void 0) {
		throw new SyntaxError('you can\'t decorate a class with inject decorator');
	}

	const instance = invoke(InjectedClass, opts, ...args);
	descriptor.initializer = () => instance;
	descriptor.value = instance;

};
