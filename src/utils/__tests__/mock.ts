/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-14 15:47
 */
import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';
import mock from '../mock';

test('mock injection', () => {

	@Store
	class InjectedStore {
		name = 'kuitos';
	}

	class ViewModel {
		@inject() store: InjectedStore;
	}

	const resumer = mock(InjectedStore as any, {
		name: 'mock',
	});

	const vm = new ViewModel();
	expect(vm.store.name).toBe('mock');

	resumer();

	const vm2 = new ViewModel();
	expect(vm2.store.name).toBe('kuitos');
});

test('mock injection not specified a model name', () => {

	class InjectedClass {
	}

	class Model {
		@inject() injected: InjectedClass;
	}

	expect(() => mock(InjectedClass as any, {})).toThrow(SyntaxError);
});
