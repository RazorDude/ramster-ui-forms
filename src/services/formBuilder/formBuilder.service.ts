import {AutocompleteFieldDataInterface} from '../../inputs/autocomplete/autocomplete.interfaces'
import {CheckboxFieldDataInterface} from '../../inputs/checkbox/checkbox.interfaces'
import {DatepickerFieldDataInterface} from '../../inputs/datepicker/datepicker.interfaces'
import {FileInputFieldDataInterface} from '../../inputs/file/file.interfaces'
import {FormFieldsInterface} from './formBuilder.interfaces'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Injectable} from '@angular/core'
import {InputFieldDataInterface} from '../../inputs/input/input.interfaces'
import {SelectFieldDataInterface} from '../../inputs/select/select.interfaces'
import {SlideToggleFieldDataInterface} from '../../inputs/slideToggle/slideToggle.interfaces'
import {TextareaFieldDataInterface} from '../../inputs/textarea/textarea.interfaces'
import validators from '../../validators'

@Injectable()
export class FormBuilderService {
	directValueValidatorNames = ['checkEmailInUse', 'matchSibling']
	plainValidatorNames = ['arrayNotEmpty', 'objectNotEmpty', 'validateEmail']
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
					placeholder: item.label,
					type: item.type
				} as any,
				formControlValidators = []
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
			if (item.formControlValidators instanceof Array) {
				formControlValidators = formControlValidators.concat(item.formControlValidators)
			}
			if (item.validations) {
				item.validations.forEach((options) => {
					if (this.directValueValidatorNames.indexOf(options.type) !== -1) {
						formControlValidators.push(validators[options.type](options.value))
						return
					}
					if (this.plainValidatorNames.indexOf(options.type) !== -1) {
						formControlValidators.push(validators[options.type])
						return
					}
					if (options.type === 'max') {
						formControlValidators.push(Validators.max(options.value))
						return
					}
					if (options.type === 'min') {
						formControlValidators.push(Validators.min(options.value))
						return
					}
					if (options.type === 'required') {
						formControlValidators.push(Validators.required)
						return
					}
				})
			}
			itemFieldData.inputFormControl = new FormControl(
				typeof itemFieldData.initialValue === 'undefined' ? null : itemFieldData.initialValue,
				formControlValidators
			)
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
