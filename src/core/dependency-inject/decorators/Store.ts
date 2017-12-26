/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-12
 */

import { isString } from 'lodash';
import { v4 } from 'uuid';
import { storeSymbol } from '../meta';
import namedModelDecorator from './namedModelDecorator';

export default (arg1: any) => {

	// if decorator named
	// eg. @Store('xStore') class Store {}
	if (isString(arg1)) {
		return namedModelDecorator(arg1, storeSymbol);
	}

	const name = v4();
	return namedModelDecorator(name, storeSymbol)(arg1);
};
