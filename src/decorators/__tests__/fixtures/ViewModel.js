/**
 * @author Kuitos
 * @homepage https://github.com/kuitos/
 * @since 2017-08-25
 */

import ViewModel from '../../ViewModel';

@ViewModel
export default class Store {

	filed = 'viewModel';

	constructor(id) {
		this.id = id;
	}

	getFiled() {
		return this.filed;
	}

	getId() {
		return this.id;
	}

}
