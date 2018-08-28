/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-24 11:30
 */
import { action } from 'mobx';
import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';
import useStrict from '../configure';

test('store actions should not return anythings when in strict mode', () => {

	useStrict(true);

	@Store
	class StoreClass {
		name = 'kuitos';

		@action updateWithThrowException() {
			return this.name = 'kuitos lau error';
		}

		@action update() {
			this.name = 'kuitos lau';
		}
	}

	class ViewModel {
		@inject() store: StoreClass;
	}

	const vm = new ViewModel();
	expect(vm.store.name).toBe('kuitos');
	expect(vm.store.update()).toBeUndefined();
	expect(vm.store.name).toBe('kuitos lau');

	expect(() => vm.store.updateWithThrowException()).toThrow(SyntaxError);
	expect(vm.store.name).toBe('kuitos lau error');

});
