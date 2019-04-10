import {AutocompleteFieldDataInterface} from '../../inputs/autocomplete/autocomplete.interfaces'
import {CheckboxFieldDataInterface} from '../../inputs/checkbox/checkbox.interfaces'
import {DatepickerFieldDataInterface} from '../../inputs/datepicker/datepicker.interfaces'
import {FileInputFieldDataInterface} from '../../inputs/file/file.interfaces'
import {InputFieldDataInterface} from '../../inputs/input/input.interfaces'
import {SelectFieldDataInterface} from '../../inputs/select/select.interfaces'
import {SlideToggleFieldDataInterface} from '../../inputs/slideToggle/slideToggle.interfaces'
import {TextareaFieldDataInterface} from '../../inputs/textarea/textarea.interfaces'

export interface FormFieldsInterface {
	autocompleteConfig?: AutocompleteFieldDataInterface
	checkboxConfig?: CheckboxFieldDataInterface
	datepickerConfig?: DatepickerFieldDataInterface
	fileConfig?: FileInputFieldDataInterface
	formControlValidators?: any[]
	inputConfig?: InputFieldDataInterface
	label: string
	masterFieldName?: string
	name: string
	selectConfig?: SelectFieldDataInterface
	slideToggleConfig?: SlideToggleFieldDataInterface
	textareaConfig?: TextareaFieldDataInterface
	type:
		'autocomplete' |
		'checkbox' |
		'datepicker' |
		'file' |
		// text inputs
		'color' |
		'email' |
		'month' |
		'number' |
		'password' |
		'search' |
		'tel' |
		'text' |
		'textarea' |
		'time' |
		'url' |
		'week' |
		// end of text inputs
		'select' |
		'slideToggle' |
		'textarea'
	validations?: FormFieldValidationsInterface[]
}

export interface FormFieldValidationsInterface {
	type:
		'arrayNotEmpty' |
		'checkEmailInUse' |
		'matchSibling' |
		'max' |
		'min' |
		'objectNotEmpty' |
		'required' |
		'validateEmail'
	value?: any
}
