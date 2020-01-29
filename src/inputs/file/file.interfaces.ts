import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'

export interface FileInputFieldDataInterface extends BaseInputFieldDataInterface {
	allowedFileTypes?: string[]
	directUpload?: boolean
	hideFileName?: boolean
	imageCropper?: boolean
	imageCropperCroppedAreaDimensionsAreEqual?: boolean
	imageCropperCroppedAreaIsRound?: boolean
	imageCropperHeight?: string
	imageCropperWidth?: string
	maxFileSizeMB?: number
	preview?: boolean
	previewCancelButton?: boolean
	previewCancelButtonForceShowInitially?: boolean
	previewCancelButtonIconUrl?: string
	previewDefaultImageUrl?: string
	previewHeight?: string
	previewIsRound?: boolean
	previewWidth?: string
	showChooseFileButton?: boolean
}
