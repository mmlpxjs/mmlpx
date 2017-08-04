/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-07-06
 */

import { get } from './container';

export default (InjectedClass, opts = { scope: 'singleton' }) => {

	const { scope } = opts;

	let instance = null;

	switch (scope) {

		case 'singleton':

			instance = get(InjectedClass);
			break;

		case 'prototype':

			instance = new InjectedClass();
			break;

		default:
			break;

	}

	return instance;
};
