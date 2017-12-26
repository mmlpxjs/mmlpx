import { modelNameSymbol, modelSymbol } from '../meta';

/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-12-19
 */

export default function namedModelDecorator(name: string, type: symbol): ClassDecorator {

	return (target: any) => {
		target[modelNameSymbol] = name;
		target[modelSymbol] = type;
		return target;
	};
}
