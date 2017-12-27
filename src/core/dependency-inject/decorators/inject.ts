/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */

import instantiate from '../instantiate';

export default <T>(InjectedClass: new() => T, ...args: any[]): PropertyDecorator => () => {

	let initializedValue: T | null = null;

	return {
		enumerable: true,
		configurable: true,
		get() {
			return initializedValue || (initializedValue = instantiate.apply(this, [InjectedClass, ...args]));
		},
		// tslint:disable-next-line
		set() {},
	};
};
