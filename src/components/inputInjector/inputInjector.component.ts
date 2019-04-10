import {AutocompleteFieldDataInterface} from '../../inputs/autocomplete/autocomplete.interfaces'
import {CheckboxFieldDataInterface} from '../../inputs/checkbox/checkbox.interfaces'
import {Component, Input} from '@angular/core'
import {DatepickerFieldDataInterface} from '../../inputs/datepicker/datepicker.interfaces'
import {FileInputFieldDataInterface} from '../../inputs/file/file.interfaces'
import {InputFieldDataInterface} from '../../inputs/input/input.interfaces'
import {SelectFieldDataInterface} from '../../inputs/select/select.interfaces'
import {SlideToggleFieldDataInterface} from '../../inputs/slideToggle/slideToggle.interfaces'
import {TextareaFieldDataInterface} from '../../inputs/textarea/textarea.interfaces'

@Component({
	selector: 'rui-input-injector',
	templateUrl: './inputInjector.template.html'
})
export class InputInjector {
	@Input() type: string
	@Input() fieldData:
		AutocompleteFieldDataInterface |
		CheckboxFieldDataInterface |
		DatepickerFieldDataInterface |
		FileInputFieldDataInterface |
		InputFieldDataInterface |
		SelectFieldDataInterface |
		SlideToggleFieldDataInterface |
		TextareaFieldDataInterface

	constructor() {
	}
}
