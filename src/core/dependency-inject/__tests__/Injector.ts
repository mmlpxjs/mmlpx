/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017/12/25
 */

import { test } from 'ava';
import { modelNameSymbol } from '../meta';

import Injector from '../Injector';

test('dump all instance from container', t => {

	const injector = Injector.newInstance();

	class Klass {
		name = 'kuitos';
	}

	class Klass1 {
		age = 18;
	}

	const klass = injector.get(Klass, { name: 'klass' });
	const klass1 = injector.get(Klass1, { name: 'klass1' });

	const collection = injector.dump();
	t.deepEqual(collection, { klass, klass1 });
});

test('load container from external', t => {

	const snapshot = {
		klass: { name: 'kuitos', age: 18 },
		klass1: { age: 18 },
	};

	const injector = Injector.newInstance();
	injector.load(snapshot);

	class Klass {
		name = 'kuitos';
		age = 18;
	}

	(Klass as any)[modelNameSymbol] = 'klass';

	const instance = injector.get<Klass>(Klass, {});
	t.is(instance.name, snapshot.klass.name);
	t.is(instance.age, snapshot.klass.age);
});
