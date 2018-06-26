/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

export const modelTypeSymbol = Symbol('mmlpx-model-type');
export const modelNameSymbol = Symbol('mmlpx-model-name');
export const storeSymbol = Symbol('Store');
export const viewModelSymbol = Symbol('ViewModel');
export const postConstructSymbol = Symbol('postConstruct');

export type Constructor<T> = new(...args: any[]) => T;

export interface IMmlpx<T> extends Constructor<T> {
	[modelNameSymbol]: string;
	[modelTypeSymbol]: symbol;
	[postConstructSymbol]?: (...args: any[]) => void;
}

export function getModelName<T>(model: IMmlpx<T>) {
	return model[modelNameSymbol];
}
