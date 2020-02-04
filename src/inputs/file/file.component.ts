import {AbstractControl} from '@angular/forms'
import {BaseInputComponent} from '../base/baseInput.component'
import {
	ChangeDetectorRef,
	Component,
	ElementRef,
	// HostListener,
	Input,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild
} from '@angular/core'
import {FileInputFieldDataInterface} from './file.interfaces'
import {FileInputImageCropperModalComponent} from './components/imageCropperModal/imageCropperModal.component'
import {GlobalEventsService, FilesRESTService} from 'ramster-ui-core'
import {MatDialog} from '@angular/material'
import {Subscription} from 'rxjs'
import * as momentNamespace from 'moment'
const moment = momentNamespace


@Component({
	selector: 'rui-file-input',
	styleUrls: [
		'./file.styles.css',
	],
	templateUrl: './file.template.html'
})
export class FileInputComponent extends BaseInputComponent implements OnChanges, OnDestroy {
	backgroundImageUrl: string = ''
	defaultMaxFileSizeMB: number = 10 // in megabytes
	dragLastMouseX: number
	dragLastMouseY: number
	dragLeaveTimeout: NodeJS.Timeout
	dropZoneActive: boolean = false
	dropZoneActiveAreaHeight: string
	dropZoneActiveAreaWidth: string
	fileName: string = ''
	forceShowPreviewCancelButton: boolean = false
	previewCancelButtonIconUrl: string = ''
	previewHeight: string = '50px'
	previewIsRound: boolean = true
	previewWidth: string = '50px'
	showChooseFileButton: boolean = true
	subscriptions: Subscription[]

	@ViewChild('inputElement') inputElementRef: ElementRef<HTMLInputElement>
	@ViewChild('masterContainer') masterContainerRef: ElementRef<HTMLElement>
	@ViewChild('placeholder') placeholderRef: ElementRef<HTMLElement>

	@Input()
	fieldData: FileInputFieldDataInterface

	constructor(
		public changeDetectorRef: ChangeDetectorRef,
		public filesRESTService: FilesRESTService,
		public globalEventsService: GlobalEventsService,
		public matDialogRef: MatDialog
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
		this.subscriptions = []
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
				return
			}
		})
		this.setDropZoneActiveAreaDimensions()
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.fieldData) {
			const currentValue = changes.fieldData.currentValue,
				currentFormControlValue = this.fieldData.inputFormControl.value
			if (
				currentValue && currentValue.previewDefaultImageUrl && currentValue.previewDefaultImageUrl.length &&
				((typeof currentFormControlValue === 'undefined') || (currentFormControlValue === null) || (currentFormControlValue === ''))
			) {
				this.backgroundImageUrl = `url('${currentValue.previewDefaultImageUrl}')`
			}
		}
		this.setDropZoneActiveAreaDimensions()
	}

	ngOnDestroy(): void {
		if ((this.subscriptions instanceof Array) && this.subscriptions.length) {
			this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe())
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
		const {
				allowedFileTypes,
				maxFileSizeMB,
				directUpload,
				imageCropper,
				imageCropperCroppedAreaDimensionsAreEqual,
				imageCropperCroppedAreaIsRound,
				imageCropperHeight,
				imageCropperWidth,
				inputFormControl
			} = this.fieldData,
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
			outputFileName = `${moment().valueOf()}${extName}`
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
			this.uploadFile(file, {inputFileName: fileName, outputFileName}, inputFormControl).then(
				() => {
					if (imageCropper) {
						let dialogRef = this.matDialogRef.open(
							FileInputImageCropperModalComponent, {
								disableClose: true,
								height: imageCropperHeight || '300px',
								maxHeight: imageCropperHeight || '300px',
								maxWidth: imageCropperWidth || '300px',
								width: imageCropperWidth || '300px'
							}
						)
						dialogRef.componentInstance.data = {
							fileUrl: `/storage/tmp/${outputFileName}`,
							imageCropperOptions: {
								croppedAreaDimensionsAreEqual: imageCropperCroppedAreaDimensionsAreEqual,
								croppedAreaHeight: '50%',
								croppedAreaIsRound: imageCropperCroppedAreaIsRound,
								croppedAreaWidth: '50%'
							}
						}
						let sub = dialogRef.afterClosed().subscribe((event) => {
							sub.unsubscribe()
							if (event) {
								this.uploadFile(
									file,
									{inputFileName: fileName, outputFileName, imageCroppingOptions: event},
									inputFormControl
								).then(
									() => {
										this.changeDetectorRef.detectChanges()
									},
									(err) => console.error(err)
								)
								return
							}
							this.changeDetectorRef.detectChanges()
						})
						this.subscriptions.push(sub)
					}
				},
				(err) => console.error(err)
			)
			return
		}
		this.fileName = fileName
		inputFormControl.patchValue(file)
		inputFormControl.markAsDirty()
	}

	onDragLeave(event: MouseEvent): void {
		// console.log('onDragLeave')
		if (!this.dropZoneActive) {
			return
		}
		if (this.dragLeaveTimeout) {
			clearTimeout(this.dragLeaveTimeout)
		}
		this.dragLastMouseX = event.clientX
		this.dragLastMouseY = event.clientY
		this.dragLeaveTimeout = setTimeout(
			() => {
				// console.log('onDragLeaveTimeout')
				// if (
				// 	this.dropZoneActive && (
				// 		(this.dragLastMouseX !== event.clientX) ||
				// 		(this.dragLastMouseY !== event.clientY)
				// 	)
				// ) {
					// console.log('onDragLeaveTimeout dropZoneActive=false', this.dragLastMouseX, this.dragLastMouseY, event.clientX, event.clientY)
					this.dropZoneActive = false
				// }
			},
			1000
		)
	}

	onDragOver(event: Event): void {
		// console.log('onDragOver')
		event.stopPropagation()
		event.preventDefault()
		if (!this.dropZoneActive) {
			this.dropZoneActive = true
		}
	}

	onDrop(event: DragEvent): void {
		event.preventDefault()
		this.dropZoneActive = false
		this.onFileChange({target: {files: event.dataTransfer.files}})
	}

	onLabelClick(): void {
		if (this.fieldData.readOnly) {
			return
		}
		this.inputElementRef.nativeElement.click()
	}

	// @HostListener('window:dragexit', ['$event'])
	// onWindowMouseMove(event: MouseEvent): void {
	// 	console.log('dragexit', event.clientX, event.clientY)
	// 	if (this.dropZoneActive) {
	// 		// console.log('dragover')
	// 		// this.dragLastMouseX = event.clientX
	// 		// this.dragLastMouseY = event.clientY
	// 		// console.log('mouseMove', this.dragLastMouseX, this.dragLastMouseY)
	// 		console.log('dragexit dropZoneActive', event.clientX, event.clientY)
	// 	}
	// }

	setDropZoneActiveAreaDimensions(): void {
		if (!this.masterContainerRef || !this.masterContainerRef.nativeElement) {
			return
		}
		setTimeout(
			() => {
				this.dropZoneActiveAreaHeight = `${this.masterContainerRef.nativeElement.clientHeight - this.placeholderRef.nativeElement.clientHeight}px`
				this.dropZoneActiveAreaWidth = `${this.masterContainerRef.nativeElement.clientWidth - 2}px`
				this.changeDetectorRef.detectChanges()
			}
		)
	}

	async uploadFile(
		file: File,
		fileOptions: {imageCroppingOptions?: {[x: string]: any}, inputFileName: string, outputFileName: string},
		inputFormControl: AbstractControl
	) {
		try {
			const {imageCroppingOptions, outputFileName} = fileOptions
			let params = {outputFileName}
			if (imageCroppingOptions) {
				for (const key in imageCroppingOptions) {
					params[`imageCroppingOptions[${key}]`] = imageCroppingOptions[key]
				}
			}
			await this.filesRESTService.upload(file, params, {handleError: true})
			this.backgroundImageUrl = `url('/storage/tmp/${fileOptions.outputFileName}')`
			this.fileName = fileOptions.inputFileName
			inputFormControl.patchValue(fileOptions.outputFileName)
			inputFormControl.markAsDirty()
		} catch(err) {
			console.error(err)
			// this.globalEventsService.notify('error', `Error uploading the file: ${err.message || 'Internal server error.'}`)
			inputFormControl.patchValue('')
		}
	}
}
