/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

import inject from '../inject';
import postConstruct from '../postConstruct';
import Store from '../Store';

let StoreClass: any = null;

beforeEach(() => {

	@Store
	class Klass {

		name: string;

		@postConstruct
		empty = null;

		constructor(name: string) {
			this.name = name;
		}
	}

	StoreClass = Klass;
});

test('inject store with init params', () => {

	class Controller {
		@inject(StoreClass, 'kuitos')
		store: any = null;

		changeStore() {
			this.store.name = 'x';
		}
	}

	// eslint-disable-next-line no-unused-vars
	const controller = new Controller();

	expect(controller.store.name).toBe('kuitos');
	controller.changeStore();
	expect(controller.store.name).toBe('x');
});

test('inject store with dynamic params', () => {

	function init(this: any) {
		return [this.name];
	}

	class Controller {

		name = 'kuitos';

		@inject(StoreClass, init)
		store: any = null;
	}

	// eslint-disable-next-line no-unused-vars
	const controller = new Controller();

	expect(controller.store.name).toBe('kuitos');
});

test('auto inject through field type definition', () => {

	class UserStore {
		age = 10;
	}

	class Controller {

		name = 'kuitos';

		@inject()
		store: UserStore;
	}

	// eslint-disable-next-line no-unused-vars
	const controller = new Controller();

	expect(controller.name).toBe('kuitos');
	expect(controller.store.age).toBe(10);

});
