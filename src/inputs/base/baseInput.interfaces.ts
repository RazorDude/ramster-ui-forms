import {AbstractControl} from '@angular/forms'
import {Subject} from 'rxjs'

export interface BaseInputFieldDataOnChangeHandlerDataInterface {
	value: any
}

export interface BaseInputFieldDataInterface {
	errorMessages?: {[x: string]: string}
	floatLabel?: string
	hideRequiredMarker?: boolean
	hint?: string
	hintAction?: Function
	inputFormControl?: AbstractControl
	label?: string
	isMobile?: boolean
	onChangeHandler?: Subject<BaseInputFieldDataOnChangeHandlerDataInterface>
	onChangeValueCheckTimeout?: number
	placeholder?: string
	readOnly?: boolean
	usePlaceholderAsLabel?: boolean
}
