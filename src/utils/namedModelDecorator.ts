/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-12-19
 */

import { isAction } from 'mobx';
import { isStrict } from '../api/configure';
import { modelNameSymbol, modelTypeSymbol } from '../core/dependency-inject/meta';

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
							throw new SyntaxError('you should not return any values from actions when you enable the strict mode!');
						}
					};
				}
			});
		}

		return target;
	};
}
