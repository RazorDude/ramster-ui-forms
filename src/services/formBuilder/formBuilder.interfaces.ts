import {AutocompleteFieldDataInterface} from '../../inputs/autocomplete/autocomplete.interfaces'
import {CheckboxFieldDataInterface} from '../../inputs/checkbox/checkbox.interfaces'
import {DatepickerFieldDataInterface} from '../../inputs/datepicker/datepicker.interfaces'
import {FileInputFieldDataInterface} from '../../inputs/file/file.interfaces'
import {FormGroup} from '@angular/forms'
import {InputFieldDataInterface} from '../../inputs/input/input.interfaces'
import {SelectFieldDataInterface} from '../../inputs/select/select.interfaces'
import {SlideToggleFieldDataInterface} from '../../inputs/slideToggle/slideToggle.interfaces'
import {TextareaFieldDataInterface} from '../../inputs/textarea/textarea.interfaces'
import {WysiwygFieldDataInterface} from '../../inputs/wysiwyg/wysiwyg.interfaces'

export interface BuildFormReturnDataInterface {
	form: FormGroup
	fieldData: {
		[fieldName: string]:
			AutocompleteFieldDataInterface |
			CheckboxFieldDataInterface |
			DatepickerFieldDataInterface |
			FileInputFieldDataInterface |
			InputFieldDataInterface |
			SelectFieldDataInterface |
			SlideToggleFieldDataInterface |
			TextareaFieldDataInterface |
			WysiwygFieldDataInterface
	}
	layout?: FormLayoutColumnDataInterface[][]
}

export interface FormFieldsInterface {
	autocompleteConfig?: AutocompleteFieldDataInterface
	checkboxConfig?: CheckboxFieldDataInterface
	datepickerConfig?: DatepickerFieldDataInterface
	fileConfig?: FileInputFieldDataInterface
	formControlValidators?: any[]
	initialValue?: any
	inputConfig?: InputFieldDataInterface
	label: string
	masterFieldName?: string
	name: string,
	positioning?: {
		colOffset?: string
		colSize: string
		rowIndex: number
		rowSpan?: number
	}
	selectConfig?: SelectFieldDataInterface
	slideToggleConfig?: SlideToggleFieldDataInterface
	textareaConfig?: TextareaFieldDataInterface
	type: FormFieldType
		
	validations?: FormFieldValidationsInterface[],
	wysiwygConfig?: WysiwygFieldDataInterface
}

export type FormFieldType =
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
	'time' |
	'url' |
	'week' |
	// end of text inputs
	'select' |
	'slideToggle' |
	'textarea' |
	'wysiwyg'

export interface FormFieldValidationsInterface {
	type: FormFieldValuedationType
	value?: any
}

export type FormFieldValuedationType = 
	'arrayNotEmpty' |
	'checkEmailInUse' |
	'matchSibling' |
	'max' |
	'maxLength' |
	'min' |
	'minLength' |
	'objectNotEmpty' |
	'required' |
	'requiredTrue' |
	'validateEmail'

export interface FormLayoutColumnDataInterface {
	colOffset?: string
	colSize?: string
	fieldName?: string
	innerRows?: FormLayoutColumnDataInterface[][]
	itemIndex?: number
}
