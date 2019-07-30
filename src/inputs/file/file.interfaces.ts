import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'

export interface FileInputFieldDataInterface extends BaseInputFieldDataInterface {
	allowedFileTypes?: string[]
	directUpload?: boolean
	hideFileName?: boolean
	maxFileSizeMB?: number
	preview?: boolean
	previewDefaultImageUrl?: string
	previewHeight?: string
	previewIsRound?: boolean
	previewWidth?: string
	showChooseFileButton?: boolean
}
