import {AbstractControl} from '@angular/forms'
import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'
import {BaseRESTService} from 'ramster-ui-core'
import {Subject} from 'rxjs'

export interface SelectFieldDataInterface extends BaseInputFieldDataInterface {
	loadSelectListOnInit?: boolean
	masterInputFormControl?: AbstractControl
	masterInputFormControlValueChangesCallback?: Subject<any>
	selectList: {text: string, value: any}[]
	selectListLoadedCallback?: Subject<any>
	selectListRESTService?: BaseRESTService
	selectListRESTServiceArgs?: {[x: string]: any}
	selectListRESTServiceFilterFieldName?: string
	selectListRESTServiceMethodName?: string
}
