/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-14 15:39
 */
import { getInjector } from '../core/dependency-inject/instantiate';
import { IMmlpx, modelNameSymbol } from '../core/dependency-inject/meta';

export default function mock<T>(Clazz: IMmlpx<T>, mockInstance: T, name?: string) {

	const container = getInjector()._getContainer();
	const modelName = Clazz[modelNameSymbol] || (Clazz[modelNameSymbol] = name!);
	if (!modelName) {
		throw new SyntaxError('you need to make sure that the model had a model name');
	}

	container.set(modelName, mockInstance);

	return function recover() {
		container.set(modelName, null);
	};
}
