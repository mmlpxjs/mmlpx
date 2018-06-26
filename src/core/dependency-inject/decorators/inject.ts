/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */

import 'reflect-metadata';
import hydrate from '../hydrate';
import instantiate from '../instantiate';
import { Constructor } from '../meta';

export default <T>(InjectedClass?: Constructor<T>, ...args: any[]): any => (target: any, property: string) => {

	const symbol = Symbol(property);

	if (!InjectedClass) {
		InjectedClass = Reflect.getMetadata('design:type', target, property);
		/* istanbul ignore next */
		if (!InjectedClass) {
			throw new SyntaxError('You must pass a Class for injection while you are not using typescript!' +
				'Or you need add "emitDecoratorMetadata: true" configuration to your tsconfig.json');
		}
	}

	return {
		enumerable: true,
		configurable: true,
		get(this: any) {

			if (!this[symbol]) {

				const initializedValue = instantiate.apply(this, [InjectedClass, ...args]);
				this[symbol] = initializedValue;
				return initializedValue;

			} else {
				hydrate(this[symbol], InjectedClass!);
				return this[symbol];
			}
		},
		// @formatter:off
		// tslint:disable-next-line
		set() {},
		// @formatter:on
	};
};
