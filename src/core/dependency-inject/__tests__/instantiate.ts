/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-12-25
 */

import { test } from 'ava';
import instantiate from '../instantiate';

test('default model instantiation is singleton', t => {

	class Klass {
		name = '';

		constructor(name: string) {
			this.name = name;
		}
	}

	const cname = 'kuitos';
	const klass = instantiate<Klass>(Klass, cname);
	t.is(klass.name, cname);

	const klass2 = instantiate<Klass>(Klass, cname);
	t.is(klass, klass2);
});
