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

import Injector, { Scope } from '../../Injector';
import { modelTypeSymbol, storeSymbol } from '../../meta';
import Store from '../Store';

const storeName = 'kuitosStore';

@Store(storeName)
class StoreClass {
	name = 'kuitos';
}

test('ViewModel decorator should add modelTypeSymbol', () => {
	expect((StoreClass as any)[modelTypeSymbol]).toBe(storeSymbol);
});

test('named store will be stored in injector', () => {

	const injector = Injector.newInstance();
	const instance = injector.get(StoreClass as any, { scope: Scope.Singleton, name: storeName });
	const snapshot = injector.dump();
	expect(snapshot[storeName]).toBe(instance);
});
