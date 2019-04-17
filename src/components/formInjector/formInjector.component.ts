import {AutocompleteFieldDataInterface} from '../../inputs/autocomplete/autocomplete.interfaces'
import {CheckboxFieldDataInterface} from '../../inputs/checkbox/checkbox.interfaces'
import {Component, Input} from '@angular/core'
import {DatepickerFieldDataInterface} from '../../inputs/datepicker/datepicker.interfaces'
import {FileInputFieldDataInterface} from '../../inputs/file/file.interfaces'
import {FormFieldsInterface, FormLayoutColumnDataInterface} from '../../services/formBuilder'
import {InputFieldDataInterface} from '../../inputs/input/input.interfaces'
import {SelectFieldDataInterface} from '../../inputs/select/select.interfaces'
import {SlideToggleFieldDataInterface} from '../../inputs/slideToggle/slideToggle.interfaces'
import {TextareaFieldDataInterface} from '../../inputs/textarea/textarea.interfaces'

@Component({
	selector: 'rui-form-injector',
	styleUrls: ['./formInjector.styles.css'],
	templateUrl: './formInjector.template.html'
})
export class FormInjector {
	@Input() fieldConfig: FormFieldsInterface[]
	@Input() fieldData:
		AutocompleteFieldDataInterface |
		CheckboxFieldDataInterface |
		DatepickerFieldDataInterface |
		FileInputFieldDataInterface |
		InputFieldDataInterface |
		SelectFieldDataInterface |
		SlideToggleFieldDataInterface |
		TextareaFieldDataInterface
	@Input() layout: FormLayoutColumnDataInterface[][]
	@Input() rowOffsets: number[] = []

	constructor() {
	}
}
