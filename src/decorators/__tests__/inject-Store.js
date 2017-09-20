/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

import { test } from 'ava';
import inject from '../inject';
import Store from '../Store';
import postConstruct from '../postConstruct';

let StoreClass = null;

test.beforeEach(() => {

	@Store
	class Klass {

		constructor(name) {
			this.name = name;
		}

		@postConstruct
		empty = null;

	}

	StoreClass = Klass;
});

test('injected store with init params', t => {

	class Controller {
		@inject(StoreClass, 'kuitos')
		store = null;

		changeStore() {
			this.store.name = 'x';
		}
	}

	// eslint-disable-next-line no-unused-vars
	const controller = new Controller();

	t.is(controller.store.name, 'kuitos');
	controller.changeStore();
	t.is(controller.store.name, 'x');
});
