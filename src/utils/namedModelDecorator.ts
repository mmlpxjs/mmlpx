/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-12-19
 */

import { isAction } from 'mobx';
import { isStrict } from '../api/configure';
import { modelNameSymbol, modelTypeSymbol } from '../core/dependency-inject/meta';
import { isPromiseLike } from '../utils/types';

export default function namedModelDecorator(name: string, type: symbol): ClassDecorator {

	return (target: any) => {
		target[modelNameSymbol] = name;
		target[modelTypeSymbol] = type;

		if (isStrict) {

			const methodNames = Object.getOwnPropertyNames(target.prototype);

			methodNames.forEach(methodName => {

				const method = target.prototype[methodName];
				// when enable the strict mode, the action should not return anything
				if (isAction(method)) {

					target.prototype[methodName] = function(this: any, ...args: any[]) {

						const returnedValue = method.apply(this, args);
						if (returnedValue) {

							const throwStrictError = () => {
								throw new SyntaxError('you should not return any values from actions when the strict mode enabled!');
							};

							if (isPromiseLike(returnedValue)) {

								const promise = returnedValue.then((resolved: any) => {
									if (resolved !== void 0) {
										throwStrictError();
									}
								});

								// for testing convenience
								if (process.env.NODE_ENV === 'test') {
									return promise;
								}
							} else {
								throwStrictError();
							}
						}
					};
				}
			});
		}

		return target;
	};
}
