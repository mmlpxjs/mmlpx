/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */

import 'reflect-metadata';
import instantiate from '../instantiate';
import { IMmlpx } from '../meta';

export default <T>(InjectedClass?: IMmlpx<T>, ...args: any[]): any => (target: T, property: string) => {

	const symbol = Symbol(property);

	return {
		enumerable: true,
		configurable: true,
		get(this: any) {

			if (!this[symbol]) {

				if (!InjectedClass) {
					InjectedClass = Reflect.getMetadata('design:type', target, property);
					if (!InjectedClass) {
						throw new SyntaxError('You must pass a Class for injection while you are not using typescript!');
					}
				}

				const initializedValue = instantiate.apply(this, [InjectedClass, ...args]);

				Object.defineProperty(this, symbol, {
					enumerable: false,
					configurable: false,
					writable: false,
					value: initializedValue,
				});

				return initializedValue;

			} else {
				return this[symbol];
			}
		},
		// tslint:disable-next-line
		set() {
		},
	};
};
