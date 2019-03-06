'use strict'

import {ActivatedRoute} from '@angular/router'
import {Component} from '@angular/core'
import {FormControl} from '@angular/forms'

import {
	AutocompleteFieldDataInterface,
	CheckboxFieldDataInterface,
	DatepickerFieldDataInterface,
	FileInputFieldDataInterface,
	InputFieldDataInterface,
	SelectFieldDataInterface,
	SlideToggleFieldDataInterface,
	TextareaFieldDataInterface
} from '../../../../src'
import {BasePageComponent, GlobalEventsService} from 'ramster-ui-core'

@Component({
	selector: 'app-page',
	templateUrl: './home.template.pug',
	styleUrls: [
		'./home.styles.scss'
	],
})
export class HomePageComponent extends BasePageComponent {
	testAutocompleteFieldData: AutocompleteFieldDataInterface
	testAutocompleteWithChipsFieldData: AutocompleteFieldDataInterface
	testCheckboxFieldData: CheckboxFieldDataInterface
	testDatepickerFieldData: DatepickerFieldDataInterface
	testFileInputFieldData: FileInputFieldDataInterface
	testInputFieldData: InputFieldDataInterface
	testSelectFieldData: SelectFieldDataInterface
	testSlideToggleFieldData: SlideToggleFieldDataInterface
	testTextAreaFieldData: TextareaFieldDataInterface

	constructor(
		activatedRoute: ActivatedRoute,
		globalEventsService: GlobalEventsService
	) {
		super(activatedRoute, globalEventsService, ['reset'], ['onInitialDataLoaded'])
	}

	reset(): void {
		super.reset()

		this.testAutocompleteFieldData = {
			inputFormControl: new FormControl(''),
			placeholder: 'Autocomplete Input',
			selectList: [{text: 'Value 1', value: 1}, {text: 'Value 2', value: 2}]
		}
		this.testAutocompleteWithChipsFieldData = {
			hasChips: true,
			inputFormControl: new FormControl([]),
			placeholder: 'Autocomplete Input With Chips',
			selectList: [{text: 'Value 1', value: 1}, {text: 'Value 2', value: 2}]
		}
		this.testCheckboxFieldData = {
			inputFormControl: new FormControl(''),
			placeholder: 'Checkbox'
		}
		this.testDatepickerFieldData = {
			inputFormControl: new FormControl(''),
			placeholder: 'Datepicker'
		}
		this.testFileInputFieldData = {
			inputFormControl: new FormControl(''),
			placeholder: 'File Input'
		}
		this.testInputFieldData = {
			inputFormControl: new FormControl(''),
			placeholder: 'Regular Input',
			type: 'text'
		}
		this.testSelectFieldData = {
			inputFormControl: new FormControl(''),
			placeholder: 'Select',
			selectList: [{text: 'Option 1', value: 1}, {text: 'Option 2', value: 2}, {text: 'Option 3', value: 3}]
		}
		this.testSlideToggleFieldData = {
			inputFormControl: new FormControl(''),
			placeholder: 'Slide Toggle'
		}
		this.testTextAreaFieldData = {
			inputFormControl: new FormControl(''),
			placeholder: 'Text Area'
		}
		this.globalEventsService.setLayoutData({hasHeader: true})
	}

	onInitialDataLoaded(): void {
	}
}
