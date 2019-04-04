import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'

export interface TextareaFieldDataInterface extends BaseInputFieldDataInterface {
	maxRows?: number
	minRows?: number
}
