/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-12
 */

import { get } from '../core/dependency-inject/container';

export default Store => (target, name, descriptor) => {

	if (name === void 0) {
		throw new SyntaxError('you can\'t decorate a class with store decorator');
	}

	const store = get(Store);

	// create a mask-object to prevent modify original store field directly
	const maskStore = Object.create(store);

	descriptor.initializer = () => maskStore;
	descriptor.value = maskStore;
};
