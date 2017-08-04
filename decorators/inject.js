/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */

import invoker from '../core/dependency-inject/invoker';

export default (InjectedClass, opts = { scope: 'singleton' }) => (target, name, descriptor) => {

	if (name === void 0) {
		throw new SyntaxError('you can\'t decorate a class with inject decorator');
	}

	const instance = invoker(InjectedClass, opts);
	descriptor.initializer = () => instance;
	descriptor.value = instance;

};
