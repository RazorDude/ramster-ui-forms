import {BuildFormReturnDataInterface, FormFieldsInterface} from './formBuilder.interfaces'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Injectable} from '@angular/core'
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
		'time',
		'url',
		'week'
	]

	constructor() {
	}

	buildForm(fields: FormFieldsInterface[]): BuildFormReturnDataInterface {
		let currentInnerRowContainerIndex = null,
			currentRowIndex = 0,
			currentRowOffset = 0,
			formControls = {},
			fieldData = {},
			innerRowTerminationIndex = null,
			layout = [],
			slaveInputFields = []
		fields.forEach((item, index) => {
			let itemFieldData = {
					placeholder: item.label,
					type: item.type
				} as any,
				formControlValidators = []
			// set up the input config based on its type
			if (item.type === 'autocomplete') {
				itemFieldData = Object.assign(itemFieldData, item.autocompleteConfig || {})
			}
			else if (item.type === 'checkbox') {
				itemFieldData = Object.assign(itemFieldData, item.checkboxConfig || {})
			}
			else if (item.type === 'datepicker') {
				itemFieldData = Object.assign(itemFieldData, item.datepickerConfig || {})
			}
			else if (item.type === 'file') {
				itemFieldData = Object.assign(itemFieldData, item.fileConfig || {})
			}
			else if (this.regularInputTypes.indexOf(item.type) !== -1) {
				itemFieldData = Object.assign(itemFieldData, item.inputConfig || {})
			}
			else if (item.type === 'select') {
				itemFieldData = Object.assign(itemFieldData, item.selectConfig || {})
			}
			else if (item.type === 'slideToggle') {
				itemFieldData = Object.assign(itemFieldData, item.slideToggleConfig || {})
			}
			else if (item.type === 'textarea') {
				itemFieldData = Object.assign(itemFieldData, item.textareaConfig || {})
			}
			else if (item.type === 'wysiwyg') {
				itemFieldData = Object.assign(itemFieldData, item.wysiwygConfig || {})
			}
			if (item.masterFieldName) {
				slaveInputFields.push({name: item.name, masterFieldName: item.masterFieldName})
			}
			// set up the input validations
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
					if (options.type === 'maxLength') {
						formControlValidators.push(Validators.maxLength(options.value))
						return
					}
					if (options.type === 'min') {
						formControlValidators.push(Validators.min(options.value))
						return
					}
					if (options.type === 'minLength') {
						formControlValidators.push(Validators.minLength(options.value))
						return
					}
					if (options.type === 'required') {
						formControlValidators.push(Validators.required)
						return
					}
					if (options.type === 'requiredTrue') {
						formControlValidators.push(Validators.requiredTrue)
						return
					}
				})
			}
			// create the actual formControl and populate the form and fieldData
			itemFieldData.inputFormControl = new FormControl(
				typeof item.initialValue === 'undefined' ? null : item.initialValue,
				formControlValidators
			)
			fieldData[item.name] = itemFieldData
			formControls[item.name] = itemFieldData.inputFormControl
			// calculate the layout positioning if a config is provided
			// TODO: this currently supports only first-level nesting, to be upgraded in the future
			if (item.positioning) {
				const {colOffset, colSize, rowIndex, rowSpan} = item.positioning
				let row = null,
					columnData = {colOffset, colSize: !colSize || !colSize.length ? '100%' : colSize , fieldName: item.name, itemIndex: index}
				// terminate the inner row sequence - we've reach the first row that doesn't fall in the inner rows column
				if ((innerRowTerminationIndex !== null) && (innerRowTerminationIndex === rowIndex)) {
					currentInnerRowContainerIndex = null
					innerRowTerminationIndex = null
				}
				// create (if needed) and get the row - regular row
				if (currentInnerRowContainerIndex === null) {
					row = layout[rowIndex - currentRowOffset]
					// the row doesn't exist yet - this is the first column for the row; create it and set the current row index
					if (!row) {
						row = []
						layout.push(row)
						currentRowIndex = rowIndex
					}
				}
				// inner row
				else {
					row = layout[currentRowIndex][currentInnerRowContainerIndex].innerRows[rowIndex - currentRowIndex]
					if (!row) {
						row = []
						layout[currentRowIndex][currentInnerRowContainerIndex].innerRows.push(row)
						currentRowOffset++
					}
				}
				// if we need to add an innerRows container
				if (rowSpan && (rowSpan >= 2)) {
					// add it before the column
					if (colOffset) {
						row.push({colSize: colOffset, innerRows: [[]]})
						row.push(columnData)
						innerRowTerminationIndex = rowIndex + rowSpan
						currentInnerRowContainerIndex = row.length - 2
						delete columnData.colOffset
					}
					// add it after the column
					else {
						row.push(columnData)
						row.push({innerRows: [[]]})
						innerRowTerminationIndex = rowIndex + rowSpan
						currentInnerRowContainerIndex = row.length - 1
					}
				}
				// otherwise - just add the column to the row
				else {
					row.push(columnData)
				}
			}
		})
		slaveInputFields.forEach((item) => {
			fieldData[item.name].masterInputFormControl = fieldData[item.masterFieldName].inputFormControl
		})
		return {
			form: new FormGroup(formControls),
			fieldData,
			layout
		}
	}
}
