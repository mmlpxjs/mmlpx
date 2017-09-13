/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-04
 */

import { modelSymbol, viewModelSymbol } from '../core/meta';
import { incorrectAsClassDecorator } from '../utils/decorator-assert';

export default (target, _, descriptor) => {

	if (descriptor !== void 0) {
		incorrectAsClassDecorator('Store');
	}

	target[modelSymbol] = viewModelSymbol;
};
