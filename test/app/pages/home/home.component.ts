'use strict'

import {ActivatedRoute} from '@angular/router'
import {Component} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'

import {
	AutocompleteFieldDataInterface,
	CheckboxFieldDataInterface,
	DatepickerFieldDataInterface,
	FileInputFieldDataInterface,
	FormBuilderService,
	FormFieldsInterface,
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
	generatedFormConfig: FormFieldsInterface[]
	generatedForm: FormGroup
	generatedFormFieldData: {
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
	testAutocompleteFieldData: AutocompleteFieldDataInterface
	testAutocompleteSlaveFieldData: AutocompleteFieldDataInterface
	testAutocompleteWithChipsFieldData: AutocompleteFieldDataInterface
	testCheckboxFieldData: CheckboxFieldDataInterface
	testDatepickerFieldData: DatepickerFieldDataInterface
	testFileInputFieldData: FileInputFieldDataInterface
	testFileInput2FieldData: FileInputFieldDataInterface
	testInputFieldData: InputFieldDataInterface
	testSelectFieldData: SelectFieldDataInterface
	testSlideToggleFieldData: SlideToggleFieldDataInterface
	testTextAreaFieldData: TextareaFieldDataInterface

	constructor(
		activatedRoute: ActivatedRoute,
		public formBuilder: FormBuilderService,
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
		this.testAutocompleteSlaveFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			masterInputFormControl: this.testAutocompleteFieldData.inputFormControl,
			placeholder: 'Autocomplete Slave Input',
			searchBoxValidators: [Validators.required],
			selectList: [],
			selectListRESTService: this.testModelRESTService,
			selectListRESTServiceFilterFieldName: 'id'
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
		this.testFileInput2FieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'File Input 2'
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

		this.generatedFormConfig = [{
				autocompleteConfig: {
					loadSelectListOnInit: true,
					searchBoxValidators: [Validators.required],
					selectList: [],
					selectListRESTService: this.testModelRESTService
				},
				label: 'Autocomplete Input',
				name: 'autocompleteInput',
				type: 'autocomplete'
			}, {
				autocompleteConfig: {
					loadSelectListOnInit: true,
					searchBoxValidators: [Validators.required],
					selectList: [],
					selectListRESTService: this.testModelRESTService,
					selectListRESTServiceFilterFieldName: 'id'
				},
				label: 'Autocomplete Slave Input',
				masterFieldName: 'autocompleteInput',
				name: 'autocompleteSlaveInput',
				type: 'autocomplete'
			}, {
				label: 'Checkbox Input',
				name: 'checkboxInput',
				type: 'checkbox'
			}, {
				label: 'Datepicker Input',
				name: 'datepickerInput',
				type: 'datepicker'
			}, {
				label: 'File Input 1',
				name: 'fileInput1',
				type: 'file'
			}, {
				label: 'File Input 2',
				name: 'fileInput2',
				type: 'file'
			}, {
				label: 'Regular Input',
				name: 'regularInput',
				type: 'text',
				validations: [{type: 'required'}]
			}, {
				label: 'Select Input',
				name: 'selectInput',
				selectConfig: {
					selectList: [{text: 'Option 1', value: 1}, {text: 'Option 2', value: 2}, {text: 'Option 3', value: 3}]
				},
				type: 'select'
			}, {
				label: 'Slide Toggle Input',
				name: 'slideToggleInput',
				type: 'slideToggle'
			}, {
				label: 'Text Area Input',
				name: 'textareaInput',
				type: 'textarea'
			}
		]
		let result = this.formBuilder.buildForm(this.generatedFormConfig)
		this.generatedForm = result.form
		this.generatedFormFieldData = result.fieldData

		this.globalEventsService.setLayoutData({hasHeader: true})
	}

	onInitialDataLoaded(): void {
	}

	populateChips(): void {
		this.testAutocompleteWithChipsFieldData.inputFormControl.patchValue([1])
	}
}
