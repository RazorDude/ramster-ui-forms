'use strict'

import {ActivatedRoute} from '@angular/router'
import {Component} from '@angular/core'
import {FormControl, Validators} from '@angular/forms'

import {
	AutocompleteFieldDataInterface,
	CheckboxFieldDataInterface,
	DatepickerFieldDataInterface,
	FileInputFieldDataInterface,
	InputFieldDataInterface,
	SelectFieldDataInterface,
	SlideToggleFieldDataInterface,
	TextareaFieldDataInterface,
	validators
} from '../../../../src'
import {BasePageComponent, GlobalEventsService} from 'ramster-ui-core'

import {TestModelRESTService} from '../../models/test/test.restService'

@Component({
	selector: 'app-page',
	templateUrl: './home.template.pug',
	styleUrls: [
		'./home.styles.scss'
	]
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
		globalEventsService: GlobalEventsService,
		public testModelRESTService: TestModelRESTService
	) {
		super(activatedRoute, globalEventsService, ['reset'], ['onInitialDataLoaded'])
	}

	reset(): void {
		super.reset()

		this.testAutocompleteFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			loadSelectListOnInit: true,
			placeholder: 'Autocomplete Input',
			searchBoxValidators: [Validators.required],
			selectList: [],
			selectListRESTService: this.testModelRESTService
		}
		this.testAutocompleteWithChipsFieldData = {
			hasChips: true,
			inputFormControl: new FormControl([], [validators.arrayNotEmpty]),
			placeholder: 'Autocomplete Input With Chips',
			selectList: [{text: 'Value 1', value: 1}, {text: 'Value 2', value: 2}]
		}
		this.testCheckboxFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'Checkbox'
		}
		this.testDatepickerFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'Datepicker'
		}
		this.testFileInputFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'File Input'
		}
		this.testInputFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'Regular Input',
			type: 'text'
		}
		this.testSelectFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'Select',
			selectList: [{text: 'Option 1', value: 1}, {text: 'Option 2', value: 2}, {text: 'Option 3', value: 3}]
		}
		this.testSlideToggleFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'Slide Toggle'
		}
		this.testTextAreaFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'Text Area'
		}
		this.globalEventsService.setLayoutData({hasHeader: true})
	}

	onInitialDataLoaded(): void {
	}

	populateChips(): void {
		this.testAutocompleteWithChipsFieldData.inputFormControl.patchValue([1])
	}
}
