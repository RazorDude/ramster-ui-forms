import {
	AutocompleteFieldDataInterface,
	CheckboxFieldDataInterface,
	DatepickerFieldDataInterface,
	FileInputFieldDataInterface,
	InputFieldDataInterface,
	SelectFieldDataInterface,
	SlideToggleFieldDataInterface,
	TextareaFieldDataInterface
} from '../../index'

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
}
