/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-25
 */

import ViewModel from '../../ViewModel';

@ViewModel
export default class Store {

	private filed = 'viewModel';
	private id: string;

	constructor(id: string) {
		this.id = id;
	}

	public getFiled() {
		return this.filed;
	}

	public getId() {
		return this.id;
	}

}
