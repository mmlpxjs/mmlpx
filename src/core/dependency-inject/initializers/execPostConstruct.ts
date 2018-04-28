/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import { isFunction } from 'lodash';
import { IMmlpx, postConstructSymbol } from '../meta';

export default function execPostConstruct<T extends IMmlpx<T>>(instance: T): void {

	const fn = instance[postConstructSymbol];

	if (isFunction(fn)) {
		fn.call(instance);
	}
}
