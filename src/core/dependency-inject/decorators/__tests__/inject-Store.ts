/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

import { SinonSpy, spy } from 'sinon';
import inject from '../inject';
import postConstruct from '../postConstruct';
import Store from '../Store';

let StoreClass: any = null;
let initSpy: SinonSpy;
let constructorSpy: SinonSpy;

beforeEach(() => {

	initSpy = spy();
	constructorSpy = spy();

	@Store
	class Klass {

		name: string;

		constructor() {
			this.name = 'kuitos';
			constructorSpy();
		}

		@postConstruct
		onInit() {
			initSpy(this.name);
		}
	}

	StoreClass = Klass;
});

test('inject store with dynamic params will throw exception', () => {

	class Controller {

		name = 'kuitos';

		@inject(StoreClass, 'kuitos')
		store: any = null;
	}
	const controller = new Controller();
	expect(() => controller.store).toThrow(SyntaxError);
});

test('postConstruct should invoke after store constructor while injecting', () => {

	class Controller {
		@inject(StoreClass)
		store: any = null;
	}

	const controller = new Controller();
	// tslint:disable-next-line
	const unused = (controller.store.name, (controller.store.name));
	expect(constructorSpy.called).toBeTruthy();
	expect(constructorSpy.callCount).toBe(1);
	expect(initSpy.calledAfter(constructorSpy)).toBeTruthy();
	expect(initSpy.calledWith(controller.store.name)).toBeTruthy();

});

test('auto inject through typescript way', () => {

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
