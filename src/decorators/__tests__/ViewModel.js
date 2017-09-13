/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-24
 */

import { test } from 'ava';
import ViewModel from '../ViewModel';
import { modelSymbol, viewModelSymbol } from '../../core/meta';

@ViewModel
class ViewModelClass {}

test('ViewModel decorator should add modelSymbol', t => {
	t.is(ViewModelClass[modelSymbol], viewModelSymbol);
});
