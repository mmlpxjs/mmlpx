/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */
import { postConstructSymbol } from '../meta';

export default (target: any, name: PropertyKey): void => {

	const fn = target[name];
	target[postConstructSymbol] = fn;
};
