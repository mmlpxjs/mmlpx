/**
 * Created by Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017/12/25
 */

import { test } from 'ava';

import Injector, { Scope } from '../Injector';

test('dump all instance from container', t => {

	const injector = Injector.newInstance();

	class Klass {
		name = 'kuitos';
	}

	class Klass1 {
		age = 18;
	}

	const klass = injector.get(Klass as any, { name: 'klass', scope: Scope.Singleton });
	const klass1 = injector.get(Klass1 as any, { name: 'klass1', scope: Scope.Singleton });

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

	const instance = injector.get<Klass>(Klass as any, { scope: Scope.Singleton, name: 'klass' });
	t.is(instance.name, snapshot.klass.name);
	t.is(instance.age, snapshot.klass.age);
});

test('singleton getting without a name will throw exception', t => {

	const injector = Injector.newInstance();

	class Klass {
		name = 'kuitos';
		age = 18;
	}

	const error = t.throws(() => injector.get(Klass as any, { scope: Scope.Singleton }), SyntaxError);
	t.is(error.message, 'A singleton injection must have a name!');
});
