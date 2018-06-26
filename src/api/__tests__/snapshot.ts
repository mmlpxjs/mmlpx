/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-25 21:01
 */
import { action, observable, runInAction } from 'mobx';
import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';
import Injector from '../../core/dependency-inject/Injector';
import { setInjector } from '../../core/dependency-inject/instantiate';
import { getModelName } from '../../core/dependency-inject/meta';
import { onSnapshot } from '../snapshot';

@Store('ageStore')
class AgeStore {
	@observable
	age = 10;

	@action
	increase() {
		this.age++;
	}
}

@Store('counterStore')
class CounterStore {
	@observable
	count = 0;

	@action
	increase() {
		this.count++;
	}
}

class Component {
	@inject()
	ageStore: AgeStore;

	@inject()
	counterStore: CounterStore;
}

let component: Component;
beforeEach(() => {
	component = new Component();
	setInjector(Injector.newInstance());
});

describe('onSnapshot function', () => {

	test('observable change should invoke onSnapshot listener', done => {

		// setInjector(Injector.newInstance());

		const disposer = onSnapshot(snapshot => {
			expect(snapshot.ageStore.age).toBe(11);
			expect(snapshot.ageStore.age).toBe(component.ageStore.age);
			expect(snapshot.counterStore.count).toBe(1);
			expect(snapshot.counterStore.count).toBe(component.counterStore.count);
			done();
		});

		runInAction(() => {
			component.ageStore.increase();
			component.counterStore.increase();
		});

		disposer();
	});

	test('could just snapshot a special model', done => {

		const disposer = onSnapshot(getModelName(AgeStore as any), snapshot => {
			// ageStore had been initialized by previous test unit
			expect(snapshot.age).toBe(11);
			expect(snapshot.age).toBe(component.ageStore.age);
			done();
		});

		runInAction(() => component.ageStore.increase());
		disposer();
	});

});

test('patch', () => {
	// TODO
});

test('applySnapshot', () => {
	// TODO
});
