/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-12
 */

import inject from './core/dependency-inject/decorators/inject';
import postConstruct from './core/dependency-inject/decorators/postConstruct';
import Store from './core/dependency-inject/decorators/Store';
import ViewModel from './core/dependency-inject/decorators/ViewModel';
import instantiate from './core/dependency-inject/instantiate';

export { modelNameSymbol } from './core/dependency-inject/meta';

export {
	inject,
	ViewModel,
	Store,
	postConstruct,
	instantiate,
};
