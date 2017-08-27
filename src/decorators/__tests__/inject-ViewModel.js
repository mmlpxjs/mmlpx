/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

import { test } from 'ava';
import { spy } from 'sinon';
import inject from '../inject';
import ViewModel from '../ViewModel';
import postConstruct from '../postConstruct';

let spyFn, onInitSpy, ViewModelClass = null;

test.beforeEach(() => {

	spyFn = spy();
	onInitSpy = spy();

	@ViewModel
	class Klass {

		constructor(name, age) {
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

	// eslint-disable-next-line no-unused-vars
	const controller = new Controller();

	t.is(spyFn.called, true);
	t.is(onInitSpy.calledAfter(spyFn), true);

});

test('inject viewModel with static params', t => {

	const name = 'kuitos';

	class Controller {

		@inject(ViewModelClass, name)
		viewModel = null;
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

		@inject(ViewModelClass, function () {
			return [this.name, this.age];
		})
		viewModel = null;
	}

	const controller = new Controller();

	t.is(controller.viewModel.name, controller.name);
	t.is(controller.viewModel.age, controller.age);

});
