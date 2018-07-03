/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-25 19:43
 */

import Injector from '../core/dependency-inject/Injector';
import { applySnapshot, getSnapshot } from './snapshot';

export default function makeHot(module: __WebpackModuleApi.Module, injector?: Injector) {

	const mmlpx = Symbol('mmlpxSnapshot');

	/**
	 * Save / Restore the state of the store while this module is hot reloaded
	 */
	if (module.hot) {

		if (module.hot.data && module.hot.data[mmlpx]) {
			applySnapshot(module.hot.data[mmlpx], injector);
		}

		module.hot.dispose(data => {
			data[mmlpx] = getSnapshot(injector);
		});
	}
}
