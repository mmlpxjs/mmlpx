/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import initializeStore from './initializers/store';
import initializeViewModel from './initializers/viewModel';
import Injector, { Scope } from './Injector';
import { modelSymbol, storeSymbol, viewModelSymbol } from './meta';

const injector = Injector.getDefaultInjector();
export default function instantiate<T>(this: any, InjectedClass: any, ...args: any[]): T {

	switch (InjectedClass[modelSymbol]) {

		case storeSymbol:
			return initializeStore.call(this, injector, InjectedClass, ...args);

		case viewModelSymbol:
			return initializeViewModel.call(this, injector, InjectedClass, ...args);

		default:
			return injector.get<T>(InjectedClass, { scope: Scope.Singleton }, ...args);
	}
}
