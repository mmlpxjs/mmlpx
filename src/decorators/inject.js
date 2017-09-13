/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */

import instantiate from '../core/instantiate';
import { incorrectAsClassPropertyDecorator } from '../utils/decorator-assert';

export default (InjectedClass, ...args) => (target, name, descriptor) => {

	if (name === void 0) {
		incorrectAsClassPropertyDecorator('inject');
	}

	descriptor.initializer = function () {
		return instantiate.apply(this, [InjectedClass, ...args]);
	};

};
