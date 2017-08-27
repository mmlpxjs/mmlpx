/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-11
 */

import invoke from '../core/dependency-inject/invoke';

import { modelSymbol } from './meta';
import { incorrectAsClassPropertyDecorator } from '../utils/decorator-assert';

import { genInitializer as genStoreInitializer, storeSymbol } from './Store';
import { genInitializer as genViewModelInitializer, viewModelSymbol } from './ViewModel';

export default (InjectedClass, ...args) => (target, name, descriptor) => {

	if (name === void 0) {
		incorrectAsClassPropertyDecorator('inject');
	}

	switch (InjectedClass[modelSymbol]) {

		case storeSymbol:
			descriptor.initializer = genStoreInitializer(InjectedClass, ...args);
			break;

		case viewModelSymbol:
			descriptor.initializer = genViewModelInitializer(InjectedClass, ...args);
			break;

		default:
			descriptor.initializer = () => invoke(InjectedClass, { scope: 'singleton' }, ...args);

	}
};
