/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

import { isFunction } from 'lodash';
import { incorrectAsClassPropertyDecorator } from '../utils/decorator-assert';

const postConstructSymbol = Symbol('postConstruct');

export const execPostConstruct = instance => {

	const fn = instance[postConstructSymbol];

	if (isFunction(fn)) {
		return fn.call(instance);
	}

	return null;
};

export default (target, name, descriptor) => {

	const fn = target[name];

	if (descriptor === void 0) {
		incorrectAsClassPropertyDecorator('postConstruct');
	}

	target[postConstructSymbol] = fn;
};
