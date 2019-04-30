import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'

export interface FileInputFieldDataInterface extends BaseInputFieldDataInterface {
	allowedFileTypes?: string[],
	directUpload?: boolean,
	hideFileName?: boolean,
	maxFileSizeMB?: number,
	preview?: boolean,
	previewHeight?: string,
	previewWidth?: string
}
