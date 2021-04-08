import {ActivatedRoute} from '@angular/router'
import {
	AutocompleteFieldDataInterface,
	CheckboxFieldDataInterface,
	DatepickerFieldDataInterface,
	FileInputFieldDataInterface,
	FormBuilderService,
	FormFieldsInterface,
	FormLayoutColumnDataInterface,
	InputFieldDataInterface,
	SelectFieldDataInterface,
	SlideToggleFieldDataInterface,
	TextareaFieldDataInterface,
	WysiwygFieldDataInterface,
	validators
} from '../../../../src'
import {BasePageComponent, GlobalEventsService} from 'ramster-ui-core'
import {Component, ElementRef, ViewChild} from '@angular/core'
import {FormControl, FormGroup, Validators} from '@angular/forms'
import {Subject} from 'rxjs'
import {TestModelRESTService} from '../../models/test/test.restService'

@Component({
	selector: 'app-page',
	templateUrl: './home.template.pug',
	styleUrls: [
		'./home.styles.scss'
	]
})
export class HomePageComponent extends BasePageComponent {
	currentTabIndex: number = 3
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
			TextareaFieldDataInterface |
			WysiwygFieldDataInterface
	}
	generatedFormLayout: FormLayoutColumnDataInterface[][]
	noAutocompleteMatchesSubject: Subject<any>
	testAutocompleteFieldData: AutocompleteFieldDataInterface
	testAutocompleteSlaveFieldData: AutocompleteFieldDataInterface
	testAutocompleteOnChangeFieldData: AutocompleteFieldDataInterface
	testAutocompleteWithChipsFieldData: AutocompleteFieldDataInterface
	testCheckboxFieldData: CheckboxFieldDataInterface
	testDatepickerFieldData: DatepickerFieldDataInterface
	testFileInputFieldData: FileInputFieldDataInterface
	testFileInput2FieldData: FileInputFieldDataInterface
	testInputFieldData: InputFieldDataInterface
	testNumberInputFieldData: InputFieldDataInterface
	testSelectFieldData: SelectFieldDataInterface
	testSlideToggleFieldData: SlideToggleFieldDataInterface
	testTextAreaFieldData: TextareaFieldDataInterface
	testWysiwygFieldData: WysiwygFieldDataInterface

	@ViewChild('autocompleMasterInput') autocompleMasterInputRef: ElementRef
	@ViewChild('regularInput') regularInputRef: ElementRef

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

		this.noAutocompleteMatchesSubject = new Subject()
		this.noAutocompleteMatchesSubject.subscribe(() => this.displayAlert())

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
		this.testAutocompleteOnChangeFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			loadSelectListOnInit: true,
			placeholder: 'Autocomplete Input with OnChange reload select list',
			searchBoxValidators: [Validators.required],
			selectList: [],
			selectListRESTServiceArgs: {orderBy: 'name', titleField: 'name', filters: {customFilter: true}},
			selectListRESTService: this.testModelRESTService,
			selectListRESTServiceMethodName: 'readOnChangeSelectTestList',
			selectListReloadOnValueChange: true,
			selectListReloadOnValueChangeCheckTimeout: 300,
			selectListReloadOnValueChangeFieldName: 'testField'
	}
		this.testAutocompleteWithChipsFieldData = {
			addNewOptionAction: new Subject<any>(),
			hasAddNewOption: true,
			hasChips: true,
			inputFormControl: new FormControl([], [validators.arrayNotEmpty]),
			placeholder: 'Autocomplete Input With Chips',
			selectList: [{text: 'Value 1', value: 1}, {text: 'Value 2', value: 2}, {text: 'Value 3', value: 3}, {text: 'Value 4', value: 4}, {text: 'Value 5', value: 5}, {text: 'Value 6', value: 6}],
			showAllOptionsWithScroll: true
		}
		this.testCheckboxFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'Checkbox with link:',
			linkText: 'Terms and conditions',
			linkHref: 'termsAndConditions'
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
		this.testNumberInputFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'Number Input With Min And Max',
			max: 10,
			min: 1,
			type: 'number'
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
		this.testWysiwygFieldData = {
			inputFormControl: new FormControl('', [Validators.required]),
			placeholder: 'Wysiwyg'
		}

		this.generatedFormConfig = [
			{
				autocompleteConfig: {
					loadSelectListOnInit: true,
					searchBoxValidators: [Validators.required],
					selectList: [],
					selectListRESTService: this.testModelRESTService
				},
				initialValue: 1,
				label: 'Autocomplete Input',
				name: 'autocompleteInput',
				positioning: {colOffset: '15%', colSize: '15%', rowIndex: 0},
				type: 'autocomplete'
			}, {
				autocompleteConfig: {
					loadSelectListOnInit: true,
					searchBoxValidators: [Validators.required],
					selectList: [],
					selectListRESTService: this.testModelRESTService,
					selectListRESTServiceFilterFieldName: 'id'
				},
				initialValue: 2,
				label: 'Autocomplete Slave Input',
				masterFieldName: 'autocompleteInput',
				name: 'autocompleteSlaveInput',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 0},
				type: 'autocomplete'
			}, {
				autocompleteConfig: {
					loadSelectListOnInit: true,
					readOnly: true,
					searchBoxValidators: [Validators.required],
					selectList: [],
					selectListRESTService: this.testModelRESTService
				},
				initialValue: 1,
				label: 'Read-Only Autocomplete Input',
				name: 'readOnlyAutocompleteInput',
				positioning: {colOffset: '5%', colSize: '15%', rowIndex: 0},
				type: 'autocomplete'
			}, {
				autocompleteConfig: {
					hasChips: true,
					loadSelectListOnInit: true,
					maxChipCount: 2,
					searchBoxValidators: [Validators.required],
					selectList: [],
					selectListRESTService: this.testModelRESTService
				},
				// initialValue: 1,
				label: 'Chips Input',
				name: 'chipsInput',
				positioning: {colOffset: '10%', colSize: '15%', rowIndex: 0},
				type: 'autocomplete'
			}, {
				autocompleteConfig: {
					loadSelectListOnInit: true,
					noMatchesOptionAction: this.noAutocompleteMatchesSubject,
					noMatchesOptionText: 'No matches found. Click here to display an alert.',
					searchBoxValidators: [Validators.required],
					selectList: [],
					selectListRESTService: this.testModelRESTService
				},
				label: 'Autocomplete Input With Custom No Matches Action',
				name: 'autocompleteInputWithCustomNoMatchesAction',
				positioning: {colOffset: '15%', colSize: '15%', rowIndex: 1},
				type: 'autocomplete'
			}, {
				autocompleteConfig: {
					isMobile: true,
					loadSelectListOnInit: true,
					searchBoxValidators: [Validators.required],
					selectList: [],
					selectListRESTService: this.testModelRESTService
				},
				initialValue: 1,
				label: 'Autocomplete With Mobile Modal',
				name: 'autocompleteInputWithMobileModal',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 1},
				type: 'autocomplete'
			}, {
				autocompleteConfig: {
					hasChips: true,
					isMobile: true,
					loadSelectListOnInit: true,
					maxChipCount: 2,
					searchBoxValidators: [Validators.required],
					selectList: [],
					selectListRESTService: this.testModelRESTService
				},
				// initialValue: 1,
				label: 'Autocomplete With Chips And Mobile Modal',
				name: 'autocompleteInputWithChipsAndMobileModal',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 1},
				type: 'autocomplete'
			}, {
				label: 'Checkbox Input',
				name: 'checkboxInput',
				positioning: {colSize: '20%', rowIndex: 2, rowSpan: 2},
				type: 'checkbox'
			}, {
				checkboxConfig: {readOnly: true},
				label: 'Read-Only Checkbox Input',
				name: 'readOnlyheckboxInput',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 2},
				type: 'checkbox'
			}, {
				label: 'Datepicker Input',
				name: 'datepickerInput',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 2},
				type: 'datepicker'
			}, {
				datepickerConfig: {readOnly: true},
				label: 'Read-Only Datepicker Input',
				name: 'readOnlyDatepickerInput',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 2},
				type: 'datepicker'
			}, {
				label: 'File Input 1',
				name: 'fileInput1',
				positioning: {colOffset: '2.5%', colSize: '15%', rowIndex: 3},
				type: 'file'
			}, {
				label: 'File Input 2',
				name: 'fileInput2',
				positioning: {colOffset: '2.5%', colSize: '15%', rowIndex: 3},
				type: 'file'
			}, {
				fileConfig: {
					directUpload: true,
					preview: true,
					previewCancelButton: true,
					previewCancelButtonIconUrl: '/static/remove-circle.svg',
					previewDefaultImageUrl: '/static/defaultImage.jpg',
					previewHeight: '100px',
					previewIsRound: false,
					previewWidth: '100px',
					showChooseFileButton: false
				},
				label: 'File Input 3',
				name: 'fileInput3',
				positioning: {colOffset: '2.5%', colSize: '15%', rowIndex: 3},
				type: 'file'
			}, {
				fileConfig: {readOnly: true},
				label: 'Read-Only File Input',
				name: 'readOnlyFileInput',
				positioning: {colOffset: '2.5%', colSize: '15%', rowIndex: 3},
				type: 'file'
			}, {
				fileConfig: {
					directUpload: true,
					imageCropper: true,
					imageCropperCroppedAreaDimensionsAreEqual: true,
					imageCropperCroppedAreaIsRound: false,
					imageCropperWidth: '390px',
					imageCropperHeight: '355px',
					preview: true,
					previewCancelButton: true,
					previewCancelButtonIconUrl: '/static/remove-circle.svg',
					previewDefaultImageUrl: '/static/defaultImage.jpg',
					previewHeight: '100px',
					previewIsRound: false,
					previewWidth: '100px',
					showChooseFileButton: false
				},
				label: 'File Input With Square Image Cropper',
				name: 'fileInputWithSquareImageCropper',
				positioning: {colOffset: '2.5%', colSize: '15%', rowIndex: 4},
				type: 'file'
			}, {
				fileConfig: {
					directUpload: true,
					imageCropper: true,
					imageCropperCroppedAreaDimensionsAreEqual: true,
					imageCropperCroppedAreaIsRound: true,
					preview: true,
					previewCancelButton: true,
					previewCancelButtonIconUrl: '/static/remove-circle.svg',
					previewDefaultImageUrl: '/static/defaultImage.jpg',
					previewHeight: '100px',
					previewIsRound: true,
					previewWidth: '100px',
					showChooseFileButton: false
				},
				label: 'File Input With Round Image Cropper',
				name: 'fileInputWithRoundImageCropper',
				positioning: {colOffset: '2.5%', colSize: '15%', rowIndex: 4},
				type: 'file'
			}, {
				label: 'Regular Input',
				name: 'regularInput',
				positioning: {colSize: '20%', rowIndex: 5},
				type: 'text',
				validations: [{type: 'required'}]
			}, {
				inputConfig: {readOnly: true, type: 'text'},
				label: 'Read-Only Regular Input',
				name: 'readOnlyRegularInput',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 5},
				type: 'text',
				validations: [{type: 'required'}]
			}, {
				label: 'Select Input',
				name: 'selectInput',
				selectConfig: {
					selectList: [{text: 'Option 1', value: 1}, {text: 'Option 2', value: 2}, {text: 'Option 3', value: 3}]
				},
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 5},
				type: 'select'
			}, {
				label: 'Read-Only Select Input',
				name: 'readOnlySelectInput',
				selectConfig: {
					readOnly: true,
					selectList: [{text: 'Option 1', value: 1}, {text: 'Option 2', value: 2}, {text: 'Option 3', value: 3}]
				},
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 5},
				type: 'select'
			}, {
				label: 'Slide Toggle Input',
				name: 'slideToggleInput',
				positioning: {colSize: '20%', rowIndex: 6},
				type: 'slideToggle'
			}, {
				label: 'Read-Only Slide Toggle Input',
				name: 'readOnlylideToggleInput',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 6},
				slideToggleConfig: {readOnly: true},
				type: 'slideToggle'
			}, {
				label: 'Text Area Input',
				initialValue: 'testText',
				name: 'textareaInput',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 6},
				type: 'textarea'
			}, {
				label: 'Read-Only Text Area Input',
				initialValue: 'testText',
				name: 'readOnlyTextareaInput',
				positioning: {colOffset: '5%', colSize: '20%', rowIndex: 6},
				textareaConfig: {readOnly: true},
				type: 'textarea'
			}, {
				label: 'Wysiwyg Input',
				initialValue: 'testText',
				name: 'wysiwygInput',
				positioning: {colSize: '99%', rowIndex: 7},
				type: 'wysiwyg'
			}, {
				label: 'Read Only Wysiwyg Input',
				initialValue: 'testText 2',
				name: 'wysiwygInput2',
				positioning: {colSize: '99%', rowIndex: 8},
				type: 'wysiwyg',
				wysiwygConfig: {
					readOnly: true
				}
			}
		]
		let result = this.formBuilder.buildForm(this.generatedFormConfig)
		this.generatedForm = result.form
		this.generatedFormFieldData = result.fieldData
		this.generatedFormLayout = result.layout

		this.globalEventsService.pageLoaded({hasHeader: true})
	}

	onInitialDataLoaded(): void {
		let fieldData = this.generatedFormFieldData.fileInput3 as FileInputFieldDataInterface
		fieldData.previewDefaultImageUrl = '/static/food-image.jpg'
	}

	displayAlert(): void {
		alert('Alert.')
	}

	populateChips(): void {
		this.testAutocompleteWithChipsFieldData.inputFormControl.patchValue([1])
	}

	saveForm(): void {
		const {generatedForm, generatedFormFieldData} = this
		for (const key in generatedFormFieldData) {
			generatedFormFieldData[key].inputFormControl.markAsTouched()
			generatedFormFieldData[key].inputFormControl.updateValueAndValidity()
		}
		generatedForm.markAsTouched()
		generatedForm.updateValueAndValidity()
	}
}
