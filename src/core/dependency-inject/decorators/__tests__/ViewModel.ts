/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-24
 */

import { modelTypeSymbol, viewModelSymbol } from '../../meta';
import ViewModel from '../ViewModel';

const viewModelName = 'kuitosViewModel';

@ViewModel(viewModelName)
class ViewModelClass {
}

test('ViewModel decorator should add modelTypeSymbol', () => {
	expect((ViewModelClass as any)[modelTypeSymbol]).toBe( viewModelSymbol);
});

// test('named ViewModel will be stored in injector', t => {
//
// 	const injector = Injector.newInstance();
// 	const instance = instantiate(ViewModelClass as any);
// 	const snapshot = injector.dump();
// 	expect(snapshot[viewModelName]).toBe( instance);
// });
