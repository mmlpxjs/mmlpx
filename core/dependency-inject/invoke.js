/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-06
 */

import { get } from './container';

export default (InjectedClass, opts = { scope: 'singleton' }, ...args) => {

	const { scope } = opts;

	let instance = null;

	switch (scope) {

		case 'singleton':

			instance = get(InjectedClass, ...args);
			break;

		case 'prototype':

			instance = new InjectedClass(...args);
			break;

		default:
			break;

	}

	return instance;
};
