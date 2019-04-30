import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'

export interface InputFieldDataInterface extends BaseInputFieldDataInterface {
	type:
		'color' |
		'email' |
		'month' |
		'number' |
		'password'|
		'search' |
		'tel' |
		'text' |
		'textarea' |
		'time' |
		'url' |
		'week'
}
