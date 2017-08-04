/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-12
 */

import inject from './decorators/inject';
import viewModel from './decorators/viewModel';
import store from './decorators/store';
import invoker from './core/dependency-inject/invoker';

export {
	inject,
	invoker,
	viewModel,
	store
};
