/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2018-08-24 11:10
 */

export let isStrict = false;

export default function useStrict(strict: boolean) {
	const prevStrict = isStrict;
	isStrict = strict;
	return prevStrict;
}
