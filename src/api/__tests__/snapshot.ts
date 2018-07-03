/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-25 21:01
 */
import { action, autorun, IReactionDisposer, observable, runInAction } from 'mobx';
import inject from '../../core/dependency-inject/decorators/inject';
import Store from '../../core/dependency-inject/decorators/Store';
import Injector, { Entry, IContainer } from '../../core/dependency-inject/Injector';
import { setInjector } from '../../core/dependency-inject/instantiate';
import { getModelName } from '../../core/dependency-inject/meta';
import { applySnapshot, onSnapshot } from '../snapshot';

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

@Store('arrayStore')
class ArrayStore {
	@observable
	data: number[] = [];
}

@Store('mapStore')
class MapStore {
	@observable
	data = new Map();
}

class Component {
	@inject()
	ageStore: AgeStore;

	@inject()
	counterStore: CounterStore;
}

let component: Component;
let disposer: IReactionDisposer;
beforeEach(() => {
	setInjector(Injector.newInstance());
	component = new Component();
});

afterEach(() => {
	disposer();
});

describe('onSnapshot function', () => {

	test('observable change should invoke onSnapshot listener', () => {

		disposer = onSnapshot(snapshot => {
			expect(snapshot.ageStore.age).toBe(11);
			expect(snapshot.ageStore.age).toBe(component.ageStore.age);
			expect(snapshot.counterStore.count).toBe(1);
			expect(snapshot.counterStore.count).toBe(component.counterStore.count);
		});

		runInAction(() => {
			component.ageStore.increase();
			component.counterStore.increase();
		});
	});

	test('could just snapshot a special model', () => {

		disposer = onSnapshot(getModelName(AgeStore as any), snapshot => {
			// ageStore had been initialized by previous test unit
			expect(snapshot.age).toBe(11);
			expect(snapshot.age).toBe(component.ageStore.age);
		});

		runInAction(() => component.ageStore.increase());
	});

	test('self constructed injector without lruCache should be convert to reactive automatically', () => {

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

		disposer = onSnapshot(snapshot => {
			expect(snapshot.ageStore.age).toBe(11);
			expect(snapshot.counterStore.count).toBe(1);
		});

		runInAction(() => {
			component.ageStore.increase();
			component.counterStore.increase();
		});

		const patch = {
			ageStore: {
				age: 20,
			},
		};
		applySnapshot(patch);
		expect(component.ageStore.age).toBe(patch.ageStore.age);
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
		ageStore: {
			age: 11,
		},
		counterStore: {
			count: 20,
		},
	};
	applySnapshot(patcher);
	expect(vm.counterStore.count).toBe(20);
	expect(vm.ageStore.age).toBe(11);
});

test('different typed data should be snapshotted well', () => {

	class ViewModel {
		@inject()
		array: ArrayStore;
		@inject()
		map: MapStore;
	}

	const vm = new ViewModel();
	let snapshotArray: any;
	let snapshotMap: any;

	disposer = onSnapshot(snapshot => {
		snapshotArray = snapshot.arrayStore && snapshot.arrayStore.data;
		snapshotMap = snapshot.mapStore && snapshot.mapStore.data;
	});

	vm.array.data.push(1);
	expect(snapshotArray).toEqual([1]);

	vm.map.data.set('name', 'kuitos');
	expect(snapshotMap.name).toBe('kuitos');
});

test('models should be activated after snapshot applied', () => {

	const patcher = {
		TypedStore: {
			name: 'kuitos',
			books: [1, 2, 3],
			map: {
				key1: '1',
				key2: '2',
			},
		},
	};

	applySnapshot(patcher);

	@Store('TypedStore')
	class TypedStore {
		@observable name: string;
		@observable books: number[];
		@observable map = new Map<string, any>();

		@action addBook(book: number) {
			this.books.push(book);
		}

		@action addMapMember(k: string, v: any) {
			this.map.set(k, v);
		}

		@action setName(name: string) {
			this.name = name;
		}
	}

	class ViewModel {
		@inject() store: TypedStore;
	}

	const vm = new ViewModel();
	let vmName: string;
	let vmBooks: number[];
	let vmMap: Map<string, any>;
	disposer = autorun(() => {
		vmName = vm.store.name;
		vmBooks = vm.store.books;
		vmMap = vm.store.map;
	});

	const store = patcher.TypedStore;
	expect(vmName!).toBe(store.name);
	expect(vmBooks!.length).toEqual(store.books.length);
	expect(vmBooks![0]).toEqual(store.books[0]);
	expect(vmBooks![2]).toEqual(store.books[2]);
	expect(vmMap!.get('key1')).toBe(store.map.key1);

	const newPatcher = {
		TypedStore: {
			name: 'a',
			books: [4, 5],
			map: {
				key3: '3',
			},
		},
	};
	applySnapshot(newPatcher);
	const newStore = newPatcher.TypedStore;
	expect(vmName!).toBe(newStore.name);
	expect(vmBooks!.length).toBe(newStore.books.length);
	expect(vmBooks![0]).toBe(newStore.books[0]);
	expect(vmBooks![1]).toBe(newStore.books[1]);
	expect(vmMap!.get('key1')).toBeUndefined();
	expect(vmMap!.get('key2')).toBeUndefined();
	expect(vmMap!.get('key3')).toBe(newStore.map.key3);
});
