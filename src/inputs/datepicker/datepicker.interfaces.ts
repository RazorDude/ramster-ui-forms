import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'

export interface DatepickerFieldDataInterface extends BaseInputFieldDataInterface {
	maxDate?: Date
	minDate?: Date
}
