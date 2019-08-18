import {BaseInputComponent} from '../base/baseInput.component'
import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core'
import {FileInputFieldDataInterface} from './file.interfaces'
import {GlobalEventsService, FilesRESTService} from 'ramster-ui-core'
import * as moment from 'moment'


@Component({
	selector: 'rui-file-input',
	styleUrls: [
		'./file.styles.css',
	],
	templateUrl: './file.template.html'
})
export class FileInputComponent extends BaseInputComponent implements OnChanges {
	backgroundImageUrl: string = ''
	defaultMaxFileSizeMB: 10 // in megabytes
	@ViewChild('fileInput') fileInputElement: ElementRef<HTMLInputElement>
	fileName: string = ''
	forceShowPreviewCancelButton: boolean = false
	previewCancelButtonIconUrl: string = ''
	previewHeight: string = '50px'
	previewIsRound: boolean = true
	previewWidth: string = '50px'
	showChooseFileButton: boolean = true

	@Input()
	fieldData: FileInputFieldDataInterface

	constructor(
		public globalEventsService: GlobalEventsService,
		public filesRESTService: FilesRESTService
	) {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()
		const {
			inputFormControl,
			previewCancelButtonForceShowInitially,
			previewCancelButtonIconUrl,
			previewDefaultImageUrl,
			previewHeight,
			previewIsRound,
			previewWidth,
			showChooseFileButton
		} = this.fieldData
		if (previewHeight) {
			this.previewHeight = previewHeight
		}
		this.forceShowPreviewCancelButton = previewCancelButtonForceShowInitially || false
		if (previewCancelButtonIconUrl) {
			this.previewCancelButtonIconUrl = `url(${previewCancelButtonIconUrl})`
		}
		if (previewDefaultImageUrl) {
			this.backgroundImageUrl = `url('${previewDefaultImageUrl}')`
		}
		this.previewIsRound = typeof previewIsRound === 'undefined' ? true : previewIsRound
		if (previewWidth) {
			this.previewWidth = previewWidth
		}
		this.showChooseFileButton = typeof showChooseFileButton === 'undefined' ? true : showChooseFileButton
		inputFormControl.valueChanges.subscribe((value) => {
			if (value === '') {
				this.backgroundImageUrl = this.fieldData.previewDefaultImageUrl ? `url('${this.fieldData.previewDefaultImageUrl}')` : ''
				this.fileName = ''
				inputFormControl.markAsDirty()
			}
		})
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('changes')
		if (changes.fieldData) {
			const currentValue = changes.fieldData.currentValue,
				previousValue = changes.fieldData.previousValue,
				currentFormControlValue = this.fieldData.inputFormControl.value
			console.log('changes.fieldData', currentValue, ';', previousValue, ';', currentFormControlValue)
			if (
				currentValue &&
				(!previousValue || (currentValue.previewDefaultImageUrl !== previousValue.previewDefaultImageUrl)) &&
				((typeof currentFormControlValue === 'undefined') || (currentFormControlValue === null) || (currentFormControlValue === ''))
			) {
				this.backgroundImageUrl = `url('${currentValue.previewDefaultImageUrl}')`
				console.log(this.backgroundImageUrl)
			}
		}
	}

	getExtName(fileName: string): string {
		const extNameRegex = new RegExp(/\.[^/.]+$/)
		let extName = extNameRegex.exec(fileName) as any
		return extName && extName[0] || ''
	}

	/* direct uploads:
	 * 1. the file is checked for type and size
	 * 2. the file is uploaded to the tmp folder on select
	 * 3. this.fileName is set to the original file name
	 * 4. the formControl value is patched to the name of the tmpFile
	 *
	 * regular file selection:
	 * 1. the file is checked for type and size
	 * 2. this.fileName is set to the original file name
	 * 3. the formControl value is patched to the whole file object
	*/
	onFileChange(event: any): void {
		const {allowedFileTypes, maxFileSizeMB, directUpload, inputFormControl} = this.fieldData,
			file = event.target.files[0] as File
		// if the user has deselected the currently selected file
		if (!file) {
			if ((inputFormControl.value !== '') || this.forceShowPreviewCancelButton) {
				this.forceShowPreviewCancelButton = false
				inputFormControl.patchValue('')
			}
			return
		}
		const fileName = file.name,
			fileSize = file.size / 1000000,
			maxFileSize = maxFileSizeMB || this.defaultMaxFileSizeMB,
			extName = this.getExtName(fileName),
			outputFileName = `${moment.utc().valueOf()}${extName}`
		// check whether the file type is allowed by extension
		if ((allowedFileTypes instanceof Array) && (allowedFileTypes.indexOf(extName) === -1)) {
			this.globalEventsService.notify('error', 'The provided file\'s type is not allowed for this field.')
			inputFormControl.patchValue('')
			return
		}
		// check wthere the file size is ok
		if (fileSize > maxFileSize) {
			this.globalEventsService.notify('error', 'The provided file is too large.')
			inputFormControl.patchValue('')
			return
		}
		if (directUpload) {
			// upload the file
			this.filesRESTService.upload(file, {outputFileName}, {handleError: true}).then(
				(res) => {
					this.backgroundImageUrl = `url('/storage/tmp/${outputFileName}')`
					this.fileName = fileName
					inputFormControl.patchValue(outputFileName)
					inputFormControl.markAsDirty()
				},
				(err) => {
					console.error(err)
					// this.globalEventsService.notify('error', `Error uploading the file: ${err.message || 'Internal server error.'}`)
					inputFormControl.patchValue('')
				}
			)
			return
		}
		this.fileName = fileName
		inputFormControl.patchValue(file)
		inputFormControl.markAsDirty()
	}

	onLabelClick(): void {
		if (this.fieldData.readOnly) {
			return
		}
		this.fileInputElement.nativeElement.click()
	}
}
