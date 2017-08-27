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
import Store, { storeSymbol } from '../Store';
import { modelSymbol } from '../meta';

@Store
class StoreClass {}

test('ViewModel decorator should add modelSymbol', t => {
	t.is(StoreClass[modelSymbol], storeSymbol);
});

