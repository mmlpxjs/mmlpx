/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */

import instantiate from '../core/instantiate';
import { incorrectAsClassPropertyDecorator } from '../utils/decorator-assert';

export default (InjectedClass, ...args) => (target, name) => {

	if (name === void 0) {
		incorrectAsClassPropertyDecorator('inject');
	}

	let initializedValue;

	return {
		enumerable: true,
		configurable: true,
		get() {
			return initializedValue ? initializedValue : initializedValue = instantiate.apply(this, [InjectedClass, ...args]);
		},
		set() {}
	};

};
