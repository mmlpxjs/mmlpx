/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-26 15:43
 */

import { ObservableMap, runInAction } from 'mobx';
import { Constructor } from './meta';

export default function hydrate<T>(instance: T, Host: Constructor<T>, ...args: any[]) {

	if (!(instance instanceof Host)) {

		const real: any = new Host(...args);

		// awake the reactive system of the model
		Object.keys(instance).forEach((key: string) => {
			if (real[key] instanceof ObservableMap) {
				const { name, enhancer } = real[key] as ObservableMap;
				runInAction(() => real[key] = new ObservableMap((instance as any)[key], enhancer, name));
			} else {
				runInAction(() => real[key] = (instance as any)[key]);
			}
		});

		return real;
	}

	return instance;
}
