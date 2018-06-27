/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-25 21:01
 */
import { action, observable, runInAction } from 'mobx';
import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';
import Injector, { Entry, IContainer } from '../../core/dependency-inject/Injector';
import { setInjector } from '../../core/dependency-inject/instantiate';
import { getModelName } from '../../core/dependency-inject/meta';
import { onSnapshot, patch } from '../snapshot';

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
	setInjector(Injector.newInstance());
	component = new Component();
});

describe('onSnapshot function', () => {

	test('observable change should invoke onSnapshot listener', done => {

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

	test('self constructed injector without lruCache should be convert to reactive automatically', done => {

		class Container implements IContainer<string, any> {

			private container = new Map();

			set(key: string, value: any): any {
				return this.container.set(key, value);
			}

			get(key: string): any {
				return this.container.get(key);
			}

			dump(): Array<Entry<string, any>> {
				return Array.from(this.container.entries()).map(entry => {
					return { k: entry[0], v: entry[1] };
				});
			}

			load(cacheEntries: ReadonlyArray<Entry<string, any>>): void {
				this.container.clear();
				cacheEntries.forEach(entry => {
					this.container.set(entry.k, entry.v);
				});
			}
		}

		setInjector(Injector.newInstance(new Container()));

		const disposer = onSnapshot(snapshot => {
			expect(snapshot.ageStore.age).toBe(11);
			expect(snapshot.counterStore.count).toBe(1);
			done();
		});

		runInAction(() => {
			component.ageStore.increase();
			component.counterStore.increase();
		});

		disposer();
	});

});

test('snapshot patcher should be merged to injector', () => {

	class ViewModel {
		@inject()
		ageStore: AgeStore;
		@inject()
		counterStore: CounterStore;
	}

	const vm = new ViewModel();
	expect(vm.ageStore.age).toBe(10);
	const patcher = {
		counterStore: {
			count: 20,
		},
	};
	patch(patcher);
	expect(vm.counterStore.count).toBe(20);
});
