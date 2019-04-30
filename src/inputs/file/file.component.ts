import {Component, ElementRef, Input, ViewChild} from '@angular/core'
import * as moment from 'moment'

import {BaseInputComponent} from '../base/baseInput.component'
import {GlobalEventsService, FilesRESTService} from 'ramster-ui-core'
import {FileInputFieldDataInterface} from './file.interfaces'


@Component({
	selector: 'rui-file-input',
	styleUrls: [
		'./file.styles.css',
	],
	templateUrl: './file.template.html'
})
export class FileInputComponent extends BaseInputComponent {
	@Input()
	fieldData: FileInputFieldDataInterface

	backgroundImageUrl: string = ''
	defaultMaxFileSizeMB: 10 // in megabytes
	@ViewChild('fileInput') fileInputElement: ElementRef<HTMLInputElement>
	fileName: string = ''
	previewHeight: string = '50px'
	previewWidth: string = '50px'

	constructor(
		public globalEventsService: GlobalEventsService,
		public filesRESTService: FilesRESTService
	) {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()
		const {inputFormControl, previewHeight, previewWidth} = this.fieldData
		if (previewHeight) {
			this.previewHeight = previewHeight
		}
		if (previewWidth) {
			this.previewWidth = previewWidth
		}
		inputFormControl.valueChanges.subscribe((value) => {
			if (value === '') {
				this.backgroundImageUrl = ''
				this.fileName = ''
				inputFormControl.markAsDirty()
			}
		})
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
			if (inputFormControl.value !== '') {
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
			this.filesRESTService.upload(file, {outputFileName}, {handleError: false}).then(
				(res) => {
					this.backgroundImageUrl = `url('/storage/tmp/${outputFileName}')`
					this.fileName = fileName
					inputFormControl.patchValue(outputFileName)
					inputFormControl.markAsDirty()
				},
				(err) => {
					this.globalEventsService.notify('error', `Error uploading the file: ${err.message || 'Internal server error.'}`)
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
