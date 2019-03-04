import {Component, Input} from '@angular/core'
import {FormControl} from '@angular/forms'
import {Subject} from 'rxjs'

import {AutocompleteFieldDataInterface} from './autocomplete.interfaces'
import {BaseInputComponent} from '../base/baseInput.component'
import {BaseRESTService, SelectListInterface} from 'ramster-ui-core'

@Component({
	selector: 'rui-autocomplete',
	templateUrl: './autocomplete.template.html',
	styleUrls: ['../base/baseInput.styles.css']
})
export class AutocompleteComponent extends BaseInputComponent {
	@Input()
	fieldData: AutocompleteFieldDataInterface = {} as AutocompleteFieldDataInterface

	currentSelectionIndex: number = -1
	defaultSelectListRESTServiceArgs = {titleField: 'name', orderBy: 'name', orderDirection: 'asc'}
	filteredSelectList: SelectListInterface[] = []
	filteredSelectListMaxLength: number = 4
	noAutofillAttr: number = (new Date()).getTime()
	searchBox: FormControl

	constructor() {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()
		const {filteredSelectListMaxLength, searchBoxAsyncValidators, searchBoxValidators} = this.fieldData
		this.searchBox = new FormControl('', searchBoxValidators, searchBoxAsyncValidators)
		if (filteredSelectListMaxLength) {
			this.filteredSelectListMaxLength = filteredSelectListMaxLength
		}
		// set up the autocomplete filtering
		this.searchBox.valueChanges.subscribe((value) => {
			if (value.length > 1) {
				let lowerCaseValue = value.toLowerCase()
				this.filteredSelectList = this.fieldData.selectList.filter((item) => item.text.toLowerCase().indexOf(lowerCaseValue) !== -1)
				if (this.filteredSelectList.length > this.filteredSelectListMaxLength) {
					this.filteredSelectList = this.filteredSelectList.slice(0, this.filteredSelectListMaxLength).concat([{text: 'Type something in to filter the list...', value: 0}])
				} else if (this.filteredSelectList.length === 0) {
					this.filteredSelectList = [{text: 'No matches found. Type something in to filter the list...', value: 0}]
				}
				return
			}
			this.filteredSelectList = this.fieldData.selectList.slice(0, this.filteredSelectListMaxLength).concat([{text: 'Type something in to filter the list...', value: 0}])
			return
		})
		this.fieldData.inputFormControl.valueChanges.subscribe((value) => {
			if (value === null) {
				this.currentSelectionIndex = -1
				this.searchBox.patchValue('')
				return
			}
			const selectList = this.fieldData.selectList,
				currentItem = selectList[this.currentSelectionIndex]
			let valuePatched = false
			if (!currentItem || (value !== currentItem.value)) {
				for (const i in selectList) {
					const listItem = selectList[i]
					if (value === listItem.value) {
						this.currentSelectionIndex = parseInt(i, 10)
						this.searchBox.patchValue(listItem.text)
						valuePatched = true
						break
					}
				}
				if (!valuePatched) {
					this.fieldData.inputFormControl.patchValue(null)
				}
			}
		})

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
				this.fieldData.selectListRESTService.readSelectList(otherArgs).then((res) => {
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
			this.fieldData.selectListRESTService.readSelectList(this.fieldData.selectListRESTServiceArgs || this.defaultSelectListRESTServiceArgs).then((res) => {
					this.fieldData.selectList = res
				}, (err) => false
			)
		}
	}

	onFocus(): void {
		this.noAutofillAttr = (new Date()).getTime()
		if (this.searchBox.value === '') {
			this.filteredSelectList = this.fieldData.selectList.slice(0, this.filteredSelectListMaxLength).concat([{text: 'Type something in to filter the list...', value: 0}])
		}
	}

	onBlur(): void {
		const currentText = this.searchBox.value
		setTimeout(() => {
			const newText = this.searchBox.value
			if (currentText === newText) {
				const selectList = this.fieldData.selectList
				let noMatch = true
				for (const i in selectList) {
					const item = selectList[i]
					if (item.text === currentText) {
						noMatch = false
						break
					}
				}
				if (noMatch) {
					this.fieldData.inputFormControl.patchValue(null)
				}
			}
		}, 100)
	}

	onSelectionChange(event: any, value: any, index: number): void {
		const inputFormControl = this.fieldData.inputFormControl
		if (event.source.selected && (inputFormControl.value !== value)) {
			this.currentSelectionIndex = index
			inputFormControl.patchValue(value)
		}
	}
}
