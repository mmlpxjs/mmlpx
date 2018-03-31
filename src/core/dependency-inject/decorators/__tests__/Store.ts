/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-24
 */

import { test } from 'ava';
import Injector from '../../Injector';
import { modelTypeSymbol, storeSymbol } from '../../meta';
import Store from '../Store';

const storeName = 'kuitosStore';

@Store(storeName)
class StoreClass {
	name = 'kuitos';
}

test('ViewModel decorator should add modelTypeSymbol', t => {
	t.is((StoreClass as any)[modelTypeSymbol], storeSymbol);
});

test('named store will be stored in injector', t => {

	const injector = Injector.getDefaultInjector();
	const instance = injector.get<StoreClass>(StoreClass, {});
	const snapshot = injector.dump();
	t.is(snapshot[storeName], instance);
});
