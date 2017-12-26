/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-12
 */

import { isString } from 'lodash';
import { v4 } from 'uuid';
import { viewModelSymbol } from '../meta';
import namedModelDecorator from './namedModelDecorator';

export default (arg1: any) => {

	// if decorator named
	// eg. @ViewModel('xViewModel') class ViewModel {}
	if (isString(arg1)) {
		return namedModelDecorator(arg1, viewModelSymbol);
	}

	const name = v4();
	return namedModelDecorator(name, viewModelSymbol)(arg1);
};
