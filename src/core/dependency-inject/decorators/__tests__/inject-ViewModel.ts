/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

import { test } from 'ava';
import { spy } from 'sinon';
import inject from '../inject';
import postConstruct from '../postConstruct';
import ViewModel from '../ViewModel';

let spyFn: any;
let onInitSpy: any;
let ViewModelClass: any = null;

test.beforeEach(() => {

	spyFn = spy();
	onInitSpy = spy();

	@ViewModel
	class Klass {

		name: string;
		age: number;

		constructor(name: string, age: number) {
			this.name = name;
			this.age = age;
			spyFn(name);
		}

		@postConstruct
		onInit() {
			onInitSpy(this.name);
		}
	}

	ViewModelClass = Klass;
});

test('injected viewModel will only construct at initial period and postConstruct will exec after', t => {

	t.is(spyFn.called, false);

	class Controller {
		@inject(ViewModelClass)
		viewModel = null;
	}

	const controller = new Controller();
	t.is(spyFn.called, false);
	// @see https://github.com/mobxjs/mobx/blob/master/src/utils/decorators.ts#L4
	// tslint:disable-next-line
	const unused = (controller.viewModel, controller.viewModel);
	t.is(spyFn.called, true);
	t.is(spyFn.callCount, 1);
	t.is(onInitSpy.calledAfter(spyFn), true);

});

test('inject viewModel with static params', t => {

	const name = 'kuitos';

	class Controller {

		@inject(ViewModelClass, name)
		viewModel: any = null;
	}

	const controller = new Controller();

	t.is(controller.viewModel.name, name);
	t.is(spyFn.calledWith(name), true);
	t.is(onInitSpy.calledWith(name), true);

});

test('inject viewModel with dynamic params', t => {

	class Controller {

		name = 'kuitos';
		age = 18;

		@inject(ViewModelClass, function(this: any) {
			return [this.name, this.age];
		})
		viewModel: any = null;
	}

	const controller = new Controller();

	t.is(controller.viewModel.name, controller.name);
	t.is(controller.viewModel.age, controller.age);

});

test('inject viewModel with dynamic params returned by a arrow function', t => {

	class Controller {

		name = 'kuitos';
		age = 18;

		@inject(ViewModelClass, (vm: Controller) => [vm.name, vm.age])
		viewModel: any = null;
	}

	const controller = new Controller();

	t.is(controller.viewModel.name, controller.name);
	t.is(controller.viewModel.age, controller.age);

});

test('injected ViewModel instance should be independently with each other when be constructed repeatedly', t => {

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

	t.is(controllerA.viewModel.name, controllerA.name);
	t.is(controllerA.viewModel.age, controllerA.age);
	t.is(controllerB.viewModel.name, controllerB.name);
	t.is(controllerB.viewModel.age, controllerB.age);

});
