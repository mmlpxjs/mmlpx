/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-06-26 15:43
 */
import { Constructor } from './meta';

export default function hydrate<T>(instance: T, Host: Constructor<T>) {
	if (Object.getPrototypeOf(instance) !== Host.prototype) {
		Object.setPrototypeOf ? Object.setPrototypeOf(instance, Host.prototype) : (instance as any).__proto__ = Host.prototype;
	}
}
