import {ChangeDetectorRef, Component, ElementRef, Input, ViewChild} from '@angular/core'
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

	@ViewChild('autocompleteSearchBox') autocompleteSearchBoxRef: ElementRef
	@ViewChild('chipList') chipListContainer: any
	@ViewChild('chipSearchBox') chipSearchBox: ElementRef<HTMLInputElement>
	@ViewChild('autocompleteElement') inputElementRef: ElementRef

	chipJustDeselected: boolean = false
	currentSelectionIndex: number = -1
	defaultEmptyInputValue: null | [] = null
	defaultSelectListRESTServiceArgs = {titleField: 'name', orderBy: 'name', orderDirection: 'asc'}
	filteredSelectList: SelectListInterface[] = []
	filteredSelectListMaxLength: number = 4
	noAutofillName: string = `noAutofill_${(new Date()).valueOf()}`
	searchBox: FormControl
	selectedChips: SelectListInterface[] = []

	constructor(
		public changeDetectorRef: ChangeDetectorRef
	) {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()
		const {
			filteredSelectListMaxLength,
			hasChips,
			searchBoxAsyncValidators,
			searchBoxValidators,
			selectListRESTServiceMethodName,
			selectListReloadOnValueChange,
			selectListReloadOnValueChangeCheckTimeout,
			selectListReloadOnValueChangeFieldName
		} = this.fieldData
		this.noAutofillName = `noAutofill_${(new Date()).valueOf()}`
		if (hasChips) {
			this.defaultEmptyInputValue = []
			// if (!this.errorMessages.maxChipCountExceeded && this.fieldData.maxChipCount) {
			// 	this.errorMessages.maxChipCountExceeded = `You can select up to ${this.fieldData.maxChipCount} items only.`
			// }
		}
		this.searchBox = new FormControl('', searchBoxValidators, searchBoxAsyncValidators)
		if (filteredSelectListMaxLength) {
			this.filteredSelectListMaxLength = filteredSelectListMaxLength
		}
		// set up the autocomplete filtering
		this.searchBox.valueChanges.subscribe((value) => {
			// if (value === '') {
			// 	this.searchBox.patchValue('\u200b')
			// 	return
			// }
			if (selectListReloadOnValueChange) {
				const timeout = typeof selectListReloadOnValueChangeCheckTimeout === 'number' ? selectListReloadOnValueChangeCheckTimeout : 500
				setTimeout(
					() => {
						if (value && (value === this.searchBox.value) && (typeof selectListReloadOnValueChangeFieldName === 'string')) {
							let args = this.fieldData.selectListRESTServiceArgs || this.defaultSelectListRESTServiceArgs
							if (typeof args.filters === 'undefined') {
								args.filters = {}
							}
							args.filters[selectListReloadOnValueChangeFieldName] = value
							if (this.fieldData.selectListRESTService instanceof BaseRESTService) {
								this.fieldData.selectListRESTService[selectListRESTServiceMethodName || 'readSelectList'](args).then((res) => {
										this.fieldData.selectList = res
										this.filteredSelectList = this.fieldData.selectList.slice(
											0,
											this.filteredSelectListMaxLength
										)
										this.filteredSelectList.push({
											text: this.filteredSelectList.length ? 'Type something in to filter the list...' : 'No more results exist.',
											value: '_system_unselectable'
										})
										this.changeDetectorRef.detectChanges()
										if (this.fieldData.selectListLoadedCallback instanceof Subject) {
											this.fieldData.selectListLoadedCallback.next()
										}
									}, (err) => console.error(err)
								)
							}
						}
					},
					timeout
				)
			}
			if (this.chipSearchBox) {
				this.chipSearchBox.nativeElement.value = value
			}
			if (value.length > 1) {
				// if (value[0] === '\u200b') {
				// 	this.searchBox.patchValue(value.substr(1, value.length))
				// 	return
				// }
				// if (value[value.length - 1] !== '\u200b') {
				// 	this.searchBox.patchValue(`${value}\u200b`)
				// 	return
				// }
				let lowerCaseValue = value.toLowerCase().substr(0, value.length - 1),
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
				this.filteredSelectList = this.getFilteredSelectListWithoutSelectedChips()
				return
			}
			if (this.fieldData.startTypingForSuggestions) {
				this.filteredSelectList = [{text: 'Start typing to see suggestions...', value: '_system_unselectable'}]
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
						const {selectList, maxChipCount} = this.fieldData
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
						if ((typeof maxChipCount !== 'undefined') && (selectedChips.length > maxChipCount)) {
							value.splice(maxChipCount, selectedChips.length - maxChipCount)
							this.fieldData.inputFormControl.patchValue(value)
						}
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
			if (!currentItem || (value !== currentItem.value)) {
				this.setCurrentSelectionToValue(selectList, value)
			}
		})

		// set up the listener for the master input (if any)
		if (
			(this.fieldData.masterInputFormControl instanceof FormControl) &&
			(this.fieldData.selectListRESTService instanceof BaseRESTService) &&
			this.fieldData.selectListRESTServiceFilterFieldName
		) {
			// we need this after the initial tick, as sometimes the master control value can be null, then updated properly, but the events wouldn't fire in the corrent order
			setTimeout(() => {
				this.fieldData.masterInputFormControl.valueChanges.subscribe((value) => this.loadSelectListOnMasterChange(value))
				const curentValue = this.fieldData.masterInputFormControl.value
				if ((typeof curentValue !== 'undefined') && (curentValue !== null) && (curentValue !== '')) {
					this.loadSelectListOnMasterChange(curentValue)
				}
			})
		}

		// load the select list on init, if required
		if (this.fieldData.loadSelectListOnInit && (this.fieldData.selectListRESTService instanceof BaseRESTService)) {
			this.fieldData.selectListRESTService[selectListRESTServiceMethodName || 'readSelectList'](this.fieldData.selectListRESTServiceArgs || this.defaultSelectListRESTServiceArgs).then((res) => {
					this.fieldData.selectList = res
					this.setCurrentSelectionToValue(res, this.fieldData.inputFormControl.value)
					this.changeDetectorRef.detectChanges()
					if (this.fieldData.selectListLoadedCallback instanceof Subject) {
						this.fieldData.selectListLoadedCallback.next()
					}
				}, (err) => console.error(err)
			)
		} else if (this.fieldData.selectList && this.fieldData.selectList.length && (typeof this.fieldData.inputFormControl.value !== 'undefined')) {
			this.setCurrentSelectionToValue(this.fieldData.selectList, this.fieldData.inputFormControl.value)
		}
	}

	getFilteredSelectListWithoutSelectedChips(): SelectListInterface[] {
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

	loadSelectListOnMasterChange(value: any): void {
		if ((typeof value === 'undefined') || (value === null) || (value === '')) {
			this.fieldData.selectList = []
			this.fieldData.inputFormControl.patchValue(this.defaultEmptyInputValue)
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
				this.setCurrentSelectionToValue(res, this.fieldData.inputFormControl.value)
				if (this.fieldData.masterInputFormControlValueChangesCallback instanceof Subject) {
					this.fieldData.masterInputFormControlValueChangesCallback.next(value)
				}
			}, (err) => console.error(err)
		)
	}

	onFocus(): void {
		if (this.searchBox.value === '') {
			if (this.fieldData.hasChips && this.selectedChips.length) {
				this.filteredSelectList = this.getFilteredSelectListWithoutSelectedChips()
				return
			}
			if (this.fieldData.startTypingForSuggestions) {
				this.filteredSelectList = [{text: 'Start typing to see suggestions...', value: '_system_unselectable'}]
				return
			}
			const selectListLength = this.fieldData.selectList.length 
			if (selectListLength >= this.filteredSelectListMaxLength) {
				this.filteredSelectList = this.fieldData.selectList.slice(0, this.filteredSelectListMaxLength).concat([
					{text: 'Type something in to filter the list...', value: '_system_unselectable'}
				])
				return
			}
			if (selectListLength > 0) {
				this.filteredSelectList = Object.assign([], this.fieldData.selectList).concat([
					{text: 'Type something in to filter the list...', value: '_system_unselectable'}
				])
				return
			}
			this.filteredSelectList = [{text: 'No results exist.', value: '_system_unselectable'}]
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

	setCurrentSelectionToValue(selectList: SelectListInterface[], value: any): void {
		let valuePatched = false
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
			this.currentSelectionIndex = -1
			this.fieldData.inputFormControl.patchValue(this.defaultEmptyInputValue)
		}
	}
}
