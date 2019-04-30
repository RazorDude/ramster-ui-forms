import {AbstractControl} from '@angular/forms'
import {Subject} from 'rxjs'

export interface BaseInputFieldDataOnChangeHandlerDataInterface {
	value: any
}

export interface BaseInputFieldDataInterface {
	errorMessages?: {[x: string]: string}
	hint?: string
	inputFormControl?: AbstractControl
	onChangeHandler?: Subject<BaseInputFieldDataOnChangeHandlerDataInterface>
	onChangeValueCheckTimeout?: number
	placeholder?: string
	readOnly?: boolean
}
