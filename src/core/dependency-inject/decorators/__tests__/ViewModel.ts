/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-24
 */

import { test } from 'ava';
import { modelTypeSymbol, viewModelSymbol } from '../../meta';
import ViewModel from '../ViewModel';

const viewModelName = 'kuitosViewModel';

@ViewModel(viewModelName)
class ViewModelClass {
}

test('ViewModel decorator should add modelTypeSymbol', t => {
	t.is((ViewModelClass as any)[modelTypeSymbol], viewModelSymbol);
});

// test('named ViewModel will be stored in injector', t => {
//
// 	const injector = Injector.newInstance();
// 	const instance = instantiate(ViewModelClass as any);
// 	const snapshot = injector.dump();
// 	t.is(snapshot[viewModelName], instance);
// });
