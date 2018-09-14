/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-24 11:30
 */
import { action } from 'mobx';
import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';
import useStrict from '../configure';

test('store actions should not return anythings when in strict mode', async () => {

	const prev = useStrict(true);

	@Store
	class StoreClass {
		name = 'kuitos';

		@action updateWithThrowException() {
			return this.name = 'kuitos lau error';
		}

		@action update() {
			this.name = 'kuitos lau';
		}

		@action
		async asyncUpdate() {
			const name = await 'async';
			this.name = name;
		}

		@action
		async asyncUpdateWithException() {
			return this.name = await 'async error';
		}

		getName() {
			return this.name;
		}
	}

	class ViewModel {
		@inject() store: StoreClass;
	}

	const vm = new ViewModel();
	expect(vm.store.name).toBe('kuitos');
	expect(vm.store.update()).toBeUndefined();
	expect(vm.store.name).toBe('kuitos lau');

	expect(vm.store.getName()).toBe(vm.store.name);

	expect(() => vm.store.updateWithThrowException()).toThrow(SyntaxError);
	expect(vm.store.name).toBe('kuitos lau error');

	expect(await vm.store.asyncUpdate()).toBeUndefined();
	expect(vm.store.name).toBe('async');

	let error;
	try {
		await vm.store.asyncUpdateWithException();
	} catch (e) {
		error = e;
	}
	expect(error).toBeInstanceOf(SyntaxError);
	expect(vm.store.name).toBe('async error');

	useStrict(prev);
});
