/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */

import instantiate from '../instantiate';

export default <T>(InjectedClass: new() => T, ...args: any[]): any => (_: T, name: string) => {

	const symbol = Symbol(name);

	return {
		enumerable: true,
		configurable: true,
		get(this: any) {

			if (!this[symbol]) {

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
		set() {},
	};
};
