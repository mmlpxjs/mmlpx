/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-26
 */

export const incorrectAsClassDecorator = (decorator: string) => {
	throw new SyntaxError(`you can't use ${decorator} decorator with a non-class object`);
};

export const incorrectAsClassPropertyDecorator = (decorator: string) => {
	throw new SyntaxError(`you can't use ${decorator} decorator with a class`);
};
