import {Component, ElementRef, Input, ViewChild} from '@angular/core'
import {FormControl} from '@angular/forms'
import {Subject} from 'rxjs'

import {AutocompleteFieldDataInterface} from './autocomplete.interfaces'
import {BaseInputComponent} from '../base/baseInput.component'
import {BaseRESTService, SelectListInterface} from 'ramster-ui-core'

@Component({
	selector: 'rui-autocomplete',
	templateUrl: './autocomplete.template.html',
	styleUrls: [
		'../base/baseInput.styles.css'
	]
})
export class AutocompleteComponent extends BaseInputComponent {
	@Input()
	fieldData: AutocompleteFieldDataInterface = {} as AutocompleteFieldDataInterface

	@ViewChild('chipList') chipListContainer: any
	@ViewChild('chipSearchBox') chipSearchBox: ElementRef<HTMLInputElement>

	chipJustDeselected: boolean = false
	currentSelectionIndex: number = -1
	defaultEmptyInputValue: null | [] = null
	defaultSelectListRESTServiceArgs = {titleField: 'name', orderBy: 'name', orderDirection: 'asc'}
	filteredSelectList: SelectListInterface[] = []
	filteredSelectListMaxLength: number = 4
	noAutofillAttr: number = (new Date()).getTime()
	searchBox: FormControl
	selectedChips: SelectListInterface[] = []

	constructor() {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()
		const {filteredSelectListMaxLength, hasChips, searchBoxAsyncValidators, searchBoxValidators} = this.fieldData
		if (hasChips) {
			this.defaultEmptyInputValue = []
		}
		this.searchBox = new FormControl('', searchBoxValidators, searchBoxAsyncValidators)
		if (filteredSelectListMaxLength) {
			this.filteredSelectListMaxLength = filteredSelectListMaxLength
		}
		// set up the autocomplete filtering
		this.searchBox.valueChanges.subscribe((value) => {
			if (this.chipSearchBox) {
				this.chipSearchBox.nativeElement.value = value
			}
			if (value.length > 1) {
				let lowerCaseValue = value.toLowerCase(),
					selectedOptionValues = this.fieldData.hasChips ? this.fieldData.inputFormControl.value : []
				this.filteredSelectList = this.fieldData.selectList.filter((item) => {
					return (selectedOptionValues.indexOf(item.value) === -1) && (item.text.toLowerCase().indexOf(lowerCaseValue) !== -1)
				})
				if (this.filteredSelectList.length > this.filteredSelectListMaxLength) {
					this.filteredSelectList = this.filteredSelectList.slice(0, this.filteredSelectListMaxLength).concat([{text: 'Type something in to filter the list...', value: '_system_unselectable'}])
				} else if (this.filteredSelectList.length === 0) {
					this.filteredSelectList = [{text: 'No matches found. Type something in to filter the list...', value: '_system_unselectable'}]
				}
				return
			}
			if (this.chipJustDeselected) {
				this.chipJustDeselected = false
				return
			}
			if (this.fieldData.hasChips) {
				this.filteredSelectList = this.getFilteredSelectListWithoutSelectChips()
				return
			}
			this.filteredSelectList = this.fieldData.selectList.slice(
				0,
				this.filteredSelectListMaxLength
			)
			this.filteredSelectList.push({
				text: this.filteredSelectList.length ? 'Type something in to filter the list...' : 'No more results exist.',
				value: '_system_unselectable'
			})
			return
		})
		this.fieldData.inputFormControl.valueChanges.subscribe((value) => {
			if (this.fieldData.hasChips) {
				if (!(value instanceof Array)) {
					return
				}
				setTimeout(() => {
					if (this.selectedChips.length !== value.length) {
						const selectList = this.fieldData.selectList
						let selectedChips = []
						value.forEach((item) => {
							for (const i in selectList) {
								const option = selectList[i]
								if (option.value === item) {
									selectedChips.push(option)
								}
							}
						})
						this.selectedChips = selectedChips
					}
				})
				return
			}
			if ((value === null) || (value === '')) {
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
					this.fieldData.inputFormControl.patchValue(this.defaultEmptyInputValue)
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
				this.fieldData.inputFormControl.patchValue(this.defaultEmptyInputValue)
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
			this.fieldData.selectListRESTService.readSelectList(this.fieldData.selectListRESTServiceArgs || this.defaultSelectListRESTServiceArgs).then((res) => {
					this.fieldData.selectList = res
				}, (err) => false
			)
		}
	}

	getFilteredSelectListWithoutSelectChips(): SelectListInterface[] {
		const
			selectedChips = this.selectedChips,
			selectedChipsLength = selectedChips.length,
			selectList = this.fieldData.selectList,
			selectListLength = selectList.length
		let newList = [],
			selectedValues = []
		for (let i = 0; i < selectListLength; i++) {
			if (newList.length === this.filteredSelectListMaxLength) {
				break
			}
			const option = selectList[i]
			if (selectedValues.length < selectedChipsLength) {
				let found = false
				for (const j in selectedChips) {
					if (selectedChips[j].value === option.value) {
						selectedValues.push(option.value)
						found = true
						break
					}
				}
				if (found) {
					continue
				}
			}
			newList.push(option)
		}
		return newList.length ? newList : [{text: 'No more results exist.', value: '_system_unselectable'}]
	}

	onFocus(): void {
		this.noAutofillAttr = (new Date()).getTime()
		if (this.searchBox.value === '') {
			if (this.fieldData.hasChips && this.selectedChips.length) {
				this.filteredSelectList = this.getFilteredSelectListWithoutSelectChips()
				return
			}
			if (this.fieldData.selectList.length > this.filteredSelectListMaxLength) {
				this.filteredSelectList = this.fieldData.selectList.slice(0, this.filteredSelectListMaxLength).concat([
					{text: 'Type something in to filter the list...', value: '_system_unselectable'}
				])
			} else {
				this.filteredSelectList = Object.assign([], this.fieldData.selectList)
			}
		}
	}

	onBlur(): void {
		const currentText = this.searchBox.value
		setTimeout(() => {
			const newText = this.searchBox.value
			if (!newText.length || (currentText !== newText)) {
				return
			}
			if (this.fieldData.hasChips) {
				this.chipJustDeselected = true
				this.searchBox.patchValue('')
				return
			}
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
				this.fieldData.inputFormControl.patchValue(this.defaultEmptyInputValue)
			}
		}, 250)
	}

	onSelectionChange(event: any, value: any, index: number): void {
		const inputFormControl = this.fieldData.inputFormControl
		if (!event.source.selected) {
			return
		}
		if (this.fieldData.hasChips) {
			if (value !== '_system_unselectable') {
				inputFormControl.patchValue(inputFormControl.value.concat(value))
				this.selectedChips.push(this.filteredSelectList[index])
			}
			setTimeout(() => {
				this.chipJustDeselected = true
				this.searchBox.patchValue('')
			}, 100)
			return
		}
		if (inputFormControl.value !== value) {
			this.currentSelectionIndex = index
			inputFormControl.patchValue(value)
		}
	}

	removeChip(index: number): void {
		const chip = this.selectedChips[index]
		let currentChipValueIndex = null,
			currentValues = this.fieldData.inputFormControl.value
		this.selectedChips.splice(index, 1)
		if (!(currentValues instanceof Array) || !currentValues.length) {
			return
		}
		for (const i in currentValues) {
			if (currentValues[i] === chip.value) {
				currentChipValueIndex = i
				break
			}
		}
		currentValues.splice(currentChipValueIndex, 1)
		this.fieldData.inputFormControl.patchValue(currentValues)
	}
}
