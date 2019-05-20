import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'

export interface CheckboxFieldDataInterface extends BaseInputFieldDataInterface {
	linkHref?: string
	linkText?: string
	linkInFront?: boolean
}
