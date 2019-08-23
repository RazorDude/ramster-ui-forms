import {BaseInputComponent} from '../base/baseInput.component'
import {BaseRESTService} from 'ramster-ui-core'
import {Component, ElementRef, Input, ViewChild} from '@angular/core'
import {FormControl} from '@angular/forms'
import {SelectFieldDataInterface} from './select.interfaces'
import {Subject} from 'rxjs'


@Component({
	selector: 'rui-select',
	templateUrl: './select.template.html',
	styleUrls: ['../base/baseInput.styles.css']
})
export class SelectComponent extends BaseInputComponent {
	@Input()
	fieldData: SelectFieldDataInterface = {} as SelectFieldDataInterface

	// currentSelectionIndex: number = -1
	defaultSelectListRESTServiceArgs = {titleField: 'name', orderBy: 'name', orderDirection: 'asc'}

	@ViewChild('inputElement') inputElementRef: ElementRef

	constructor() {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()
		// set up the listener for the master input (if any)
		if (
			(this.fieldData.masterInputFormControl instanceof FormControl) &&
			(this.fieldData.selectListRESTService instanceof BaseRESTService) &&
			this.fieldData.selectListRESTServiceFilterFieldName
		) {
			this.fieldData.masterInputFormControl.valueChanges.subscribe((value) => {
				this.fieldData.selectList = []
				this.fieldData.inputFormControl.patchValue(null)
				if ((value === null) || (value === '')) {
					if (this.fieldData.masterInputFormControlValueChangesCallback instanceof Subject) {
						this.fieldData.masterInputFormControlValueChangesCallback.next(value)
					}
					return
				}
				let {filters, ...otherArgs} = this.fieldData.selectListRESTServiceArgs || this.defaultSelectListRESTServiceArgs
				if (!filters) {
					filters = {}
				}
				filters[this.fieldData.selectListRESTServiceFilterFieldName] = value
				otherArgs.filters = filters
				this.fieldData.selectListRESTService[this.fieldData.selectListRESTServiceMethodName || 'readSelectList'](otherArgs).then((res) => {
						this.fieldData.selectList = res
						if (this.fieldData.masterInputFormControlValueChangesCallback instanceof Subject) {
							this.fieldData.masterInputFormControlValueChangesCallback.next(value)
						}
					}, (err) => false
				)
			})
		}

		// load the select list on init, if required
		if (this.fieldData.loadSelectListOnInit && (this.fieldData.selectListRESTService instanceof BaseRESTService)) {
			this.fieldData.selectListRESTService[this.fieldData.selectListRESTServiceMethodName || 'readSelectList'](this.fieldData.selectListRESTServiceArgs || this.defaultSelectListRESTServiceArgs).then((res) => {
					this.fieldData.selectList = res
				}, (err) => false
			)
		}

		if (this.fieldData.readOnly) {
			this.fieldData.inputFormControl.disable()
		}
	}

	// onSelectionChange(event: any, value: any, index: number): void {
	// 	const inputFormControl = this.fieldData.inputFormControl
	// 	if (event.source.selected && (inputFormControl.value !== value)) {
	// 		this.currentSelectionIndex = index
	// 		inputFormControl.patchValue(value)
	// 	}
	// }
}
