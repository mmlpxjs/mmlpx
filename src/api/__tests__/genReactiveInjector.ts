/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-14 16:33
 */
import Injector from '../../core/dependency-inject/Injector';
import genReactiveInjector from '../genReactiveInjector';

test('convert injector to reactive', () => {

	const prevInjector = Injector.newInstance();
	prevInjector.load({
		name: 'kuitos',
		age: 18,
	});

	const reactiveInjector = genReactiveInjector(prevInjector);
	expect(reactiveInjector.dump()).toEqual(prevInjector.dump());

	const reactiveInjector2 = genReactiveInjector(prevInjector);
	expect(reactiveInjector2).toBe(reactiveInjector);

});
