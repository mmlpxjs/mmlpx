/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import { isFunction } from 'lodash';
import { postConstructSymbol } from '../meta';

export default function (instance) {

	const fn = instance[postConstructSymbol];

	if (isFunction(fn)) {
		return fn.call(instance);
	}

	return null;
}
