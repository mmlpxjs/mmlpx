/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

import { test } from 'ava';
import inject from '../inject';
import postConstruct from '../postConstruct';
import Store from '../Store';

let StoreClass: any = null;

test.beforeEach(() => {

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

test('inject store with init params', t => {

	class Controller {
		@inject(StoreClass, 'kuitos')
		store: any = null;

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

test('inject store with dynamic params', t => {

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

	t.is(controller.store.name, 'kuitos');
});
