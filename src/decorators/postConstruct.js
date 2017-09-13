/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

import { incorrectAsClassPropertyDecorator } from '../utils/decorator-assert';
import { postConstructSymbol } from '../core/meta';

export default (target, name, descriptor) => {

	const fn = target[name];

	if (descriptor === void 0) {
		incorrectAsClassPropertyDecorator('postConstruct');
	}

	target[postConstructSymbol] = fn;
};
