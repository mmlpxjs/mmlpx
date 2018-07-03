/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-07-03 15:49
 */
import { isArrayLikeObject, isFunction } from 'lodash';

export const isObject = (obj: any) => Object.prototype.toString.call(obj) === '[object Object]';

export const isMap = (obj: any) => Object.prototype.toString.call(obj) === '[object Map]' ||
	(obj && isFunction(obj.delete) && isFunction(obj.get) && isFunction(obj.set));

export const isArray = (obj: any) => obj && (Array.isArray(obj) || isArrayLikeObject(obj));
