import co from 'co'
import {Injectable} from '@angular/core'

import {BaseRESTService, GlobalEventsService, RequestService} from 'ramster-ui-core'


@Injectable()
export class TestModelRESTService extends BaseRESTService {
	constructor(globalEventsService: GlobalEventsService, requestService: RequestService) {
		super(globalEventsService, requestService)
		this.baseUrl += 'testModel'
	}
	
	readOnChangeSelectTestList(params): Promise<any> {
		const instance = this
		return new Promise((resolve, reject) => {
			co(function*() {
				let fakeDataset = [{"text":"Option 1","value":1},{"text":"Option 2","value":2},{"text":"Option 3","value":3},{"text":"Different Name 4","value":4},{"text":"Different Name 5","value":5},{"text":"Different Name 6","value":6}],
					results = []

				if(params.filters && params.filters.testField) {
					results	= fakeDataset.filter(function(itm){
						return itm.text.indexOf(params.filters.testField) > -1;
					});
				} else {
					results = fakeDataset.slice(0, 2)
				}

				return results
			}).then((res) => resolve(res), (err) => {
				instance.handleError(err)
				reject({error: true})
			})
		})
	}

}
