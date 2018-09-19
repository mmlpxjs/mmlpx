/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import Injector, { Scope } from '../Injector';
import { IMmlpx, modelNameSymbol } from '../meta';
import execPostConstruct from './execPostConstruct';

export default function initialize<T extends IMmlpx<T>>(this: T, injector: Injector, Store: T, ...args: any[]) {

	// store should not dynamic initialize while injecting
	if (args && args.length) {
		if (process.env.NODE_ENV === 'test') {
			throw new SyntaxError(`${Store.name}: As a singleton recipe, you should not instantiate Store with dynamic arguments!`);
		} else if (process.env.NODE_ENV !== 'production') {
			/* istanbul ignore next */
			console.error(`${Store.name}: As a singleton recipe, you should not instantiate Store with dynamic arguments!`);
		}
	}

	const name = Store[modelNameSymbol];
	const store = injector.get(Store, { scope: Scope.Singleton, name });

	execPostConstruct(store);

	return store;
}
