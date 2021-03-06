import {AbstractControl} from '@angular/forms'
import {BaseInputFieldDataInterface} from '../base/baseInput.interfaces'
import {BaseRESTService} from 'ramster-ui-core'
import {Subject} from 'rxjs'

export interface AutocompleteFieldDataInterface extends BaseInputFieldDataInterface {
	addNewOptionAction?: Subject<any>
	addNewOptionText?: string
	customSelectListOptionActions?: { [actionName: string]: Subject<any> }
	filteredSelectListMaxLength?: number
	hasAddNewOption?: boolean
	hasChips?: boolean
	loadSelectListOnInit?: boolean
	masterInputFormControl?: AbstractControl
	masterInputFormControlValueChangesCallback?: Subject<any>
	maxChipCount?: number
	noMatchesOptionAction?: Subject<any>
	noMatchesOptionText?: string
	searchBoxAsyncValidators?: any[]
	searchBoxEventsTrigger?: Subject<{methodData?: any, methodName: string}>
	searchBoxValidators?: any[]
	selectList: {text: string, value: any}[]
	selectListLoadedCallback?: Subject<any>
	selectListRESTService?: BaseRESTService
	selectListRESTServiceArgs?: {[x: string]: any}
	selectListRESTServiceFilterFieldName?: string
	selectListRESTServiceMethodName?: string
	selectListReloadOnValueChange?: boolean
	selectListReloadOnValueChangeCheckTimeout?: number
	selectListReloadOnValueChangeFieldName?: string
	showAllOptionsWithScroll?: boolean
	startTypingForSuggestions?: boolean
}
