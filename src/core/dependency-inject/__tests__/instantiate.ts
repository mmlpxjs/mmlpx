/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-12-25
 */

import instantiate from '../instantiate';
import { IMmlpx, modelNameSymbol } from '../meta';

test('default model instantiation is singleton', () => {

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
	expect(klass.name).toBe(cname);

	const klass2 = instantiate(MmlpxKlass, cname);
	expect(klass).toBe(klass2);
});
