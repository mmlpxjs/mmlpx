/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import initializeStore from './initializers/store';
import initializeViewModel from './initializers/viewModel';
import Injector, { Scope } from './Injector';
import { IMmlpx, modelNameSymbol, modelTypeSymbol, storeSymbol, viewModelSymbol } from './meta';

let uid = 0;
export const defaultInjector = Injector.newInstance();
export default function instantiate<T>(this: any, InjectedClass: IMmlpx<T>, ...args: any[]): T {

	switch (InjectedClass[modelTypeSymbol]) {

		case storeSymbol:
			return initializeStore.call(this, defaultInjector, InjectedClass, ...args);

		case viewModelSymbol:
			return initializeViewModel.call(this, defaultInjector, InjectedClass, ...args);

		default:

			const name = InjectedClass[modelNameSymbol] = InjectedClass[modelNameSymbol] || `${(InjectedClass.name || '')}_${uid++}`;

			return defaultInjector.get(InjectedClass, {
				scope: Scope.Singleton,
				name,
			}, ...args);
	}
}
