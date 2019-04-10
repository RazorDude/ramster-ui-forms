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
import {FormFieldsInterface} from './formBuilder.interfaces'
import {FormControl, FormGroup} from '@angular/forms'
import {Injectable} from '@angular/core'

@Injectable()
export class FormBuilderService {
	regularInputTypes = [
		'color',
		'email',
		'month',
		'number',
		'password',
		'search',
		'tel',
		'text',
		'textarea',
		'time',
		'url',
		'week'
	]

	constructor() {
	}

	buildForm(fields: FormFieldsInterface[]): {
		form: FormGroup,
		fieldData: {
			[fieldName: string]:
				AutocompleteFieldDataInterface |
				CheckboxFieldDataInterface |
				DatepickerFieldDataInterface |
				FileInputFieldDataInterface |
				InputFieldDataInterface |
				SelectFieldDataInterface |
				SlideToggleFieldDataInterface |
				TextareaFieldDataInterface
		}
	} {
		let formControls = {},
			fieldData = {},
			slaveInputFields = []
		fields.forEach((item) => {
			let itemFieldData = {
				inputFormControl: new FormControl(null, item.formControlValidators || []),
				placeholder: item.label,
				type: item.type
			} as any
			if (item.type === 'autocomplete') {
				itemFieldData = Object.assign(itemFieldData, item.autocompleteConfig || {})
			} else if (item.type === 'checkbox') {
				itemFieldData = Object.assign(itemFieldData, item.checkboxConfig || {})
			} else if (item.type === 'datepicker') {
				itemFieldData = Object.assign(itemFieldData, item.datepickerConfig || {})
			} else if (item.type === 'file') {
				itemFieldData = Object.assign(itemFieldData, item.fileConfig || {})
			} else if (this.regularInputTypes.indexOf(item.type) !== -1) {
				itemFieldData = Object.assign(itemFieldData, item.inputConfig || {})
			} else if (item.type === 'select') {
				itemFieldData = Object.assign(itemFieldData, item.selectConfig || {})
			} else if (item.type === 'slideToggle') {
				itemFieldData = Object.assign(itemFieldData, item.slideToggleConfig || {})
			} else if (item.type === 'textarea') {
				itemFieldData = Object.assign(itemFieldData, item.textareaConfig || {})
			}
			if (item.masterFieldName) {
				slaveInputFields.push({name: item.name, masterFieldName: item.masterFieldName})
			}
			fieldData[item.name] = itemFieldData
			formControls[item.name] = itemFieldData.inputFormControl
		})
		slaveInputFields.forEach((item) => {
			fieldData[item.name].masterInputFormControl = fieldData[item.masterFieldName].inputFormControl
		})
		return {
			form: new FormGroup(formControls),
			fieldData
		}
	}
}
