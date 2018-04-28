/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-12-25
 */

import { test } from 'ava';
import instantiate from '../instantiate';
import { IMmlpx, modelNameSymbol } from '../meta';

test('default model instantiation is singleton', t => {

	class Klass {
		name = '';

		constructor(name: string) {
			this.name = name;
		}
	}

	const MmlpxKlass = Klass as IMmlpx<Klass>;

	MmlpxKlass[modelNameSymbol] = 'test';

	const cname = 'kuitos';
	const klass = instantiate(MmlpxKlass, cname);
	t.is(klass.name, cname);

	const klass2 = instantiate(MmlpxKlass, cname);
	t.is(klass, klass2);
});
