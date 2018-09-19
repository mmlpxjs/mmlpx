/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

import { spy } from 'sinon';
import inject from '../inject';
import ViewModel from '../ViewModel';

let spyFn: any;
let ViewModelClass: any = null;

beforeEach(() => {

	spyFn = spy();

	@ViewModel
	class Klass {

		name: string;
		age: number;

		constructor(name: string, age: number) {
			this.name = name;
			this.age = age;
			spyFn(name);
		}
	}

	ViewModelClass = Klass;
});

test('injected viewModel will only construct at initial period', () => {

	expect(spyFn.called).toBe(false);

	class Controller {
		@inject(ViewModelClass)
		viewModel = null;
	}

	const controller = new Controller();
	expect(spyFn.called).toBe(false);
	// @see https://github.com/mobxjs/mobx/blob/master/src/utils/decorators.ts#L4
	// tslint:disable-next-line
	const unused = (controller.viewModel, controller.viewModel);
	expect(spyFn.called).toBe(true);
	expect(spyFn.callCount).toBe(1);

});

test('inject viewModel with static params', () => {

	const name = 'kuitos';

	class Controller {

		@inject(ViewModelClass, name)
		viewModel: any = null;
	}

	const controller = new Controller();

	expect(controller.viewModel.name).toBe(name);
	expect(spyFn.calledWith(name)).toBe(true);

});

test('inject viewModel with dynamic params', () => {

	class Controller {

		name = 'kuitos';
		age = 18;

		@inject(ViewModelClass, function(this: any) {
			return [this.name, this.age];
		})
		viewModel: any = null;
	}

	const controller = new Controller();

	expect(controller.viewModel.name).toBe(controller.name);
	expect(controller.viewModel.age).toBe(controller.age);

});

test('inject viewModel with dynamic params returned by a arrow function', () => {

	class Controller {

		name = 'kuitos';
		age = 18;

		@inject(ViewModelClass, (vm: Controller) => [vm.name, vm.age])
		viewModel: any = null;
	}

	const controller = new Controller();

	expect(controller.viewModel.name).toBe(controller.name);
	expect(controller.viewModel.age).toBe(controller.age);

});

test('injected ViewModel instance should be independently with each other when be constructed repeatedly', () => {

	// noinspection TsLint
	class Controller {
		name: string;
		age: number;
		@inject(ViewModelClass, function(this: any) {
			return [this.name, this.age];
		})
		viewModel: any = null;

		constructor(name: string, age: number) {
			this.name = name;
			this.age = age;
		}
	}

	const controllerA = new Controller('kuitos', 18);
	const controllerB = new Controller('kuitosA', 20);

	expect(controllerA.viewModel.name).toBe(controllerA.name);
	expect(controllerA.viewModel.age).toBe(controllerA.age);
	expect(controllerB.viewModel.name).toBe(controllerB.name);
	expect(controllerB.viewModel.age).toBe(controllerB.age);

});
