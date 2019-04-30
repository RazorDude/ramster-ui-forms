import {AbstractControl} from '@angular/forms'
import {Subject} from 'rxjs'

import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'
import {BaseRESTService} from 'ramster-ui-core'

export interface SelectFieldDataInterface extends BaseInputFieldDataInterface {
	loadSelectListOnInit?: boolean
	masterInputFormControl?: AbstractControl
	masterInputFormControlValueChangesCallback?: Subject<any>
	selectList: {text: string, value: any}[]
	selectListRESTService?: BaseRESTService
	selectListRESTServiceArgs?: {[x: string]: any}
	selectListRESTServiceFilterFieldName?: string
	selectListRESTServiceMethodName?: string
}
