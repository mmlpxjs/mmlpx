/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-12
 */

import { isString } from 'lodash';
import namedModelDecorator from '../../../utils/namedModelDecorator';
import { modelTypeSymbol, viewModelSymbol } from '../meta';

export default (arg1: any) => {

	// if decorator named
	// eg. @ViewModel('xViewModel') class ViewModel {}
	if (isString(arg1)) {
		return namedModelDecorator(arg1, viewModelSymbol);
	}

	(arg1 as any)[modelTypeSymbol] = viewModelSymbol;
	return arg1;
};
