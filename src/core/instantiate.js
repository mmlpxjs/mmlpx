/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-09-13
 */

import invoke from './dependency-inject/invoke';
import { modelSymbol, storeSymbol, viewModelSymbol } from './meta';
import initializeStore from './initializers/store';
import initializeViewModel from './initializers/viewModel';

export default function instantiate(InjectedClass, ...args) {

	switch (InjectedClass[modelSymbol]) {

		case storeSymbol:
			return initializeStore.apply(this, [InjectedClass, ...args]);

		case viewModelSymbol:
			return initializeViewModel.apply(this, [InjectedClass, ...args]);

		default:
			return invoke(InjectedClass, { scope: 'singleton' }, ...args);
	}
}
