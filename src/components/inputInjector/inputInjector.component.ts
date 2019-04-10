'use strict'
import {
	AutocompleteFieldDataInterface,
	CheckboxFieldDataInterface,
	DatepickerFieldDataInterface,
	FileInputFieldDataInterface,
	InputFieldDataInterface,
	SelectFieldDataInterface,
	SlideToggleFieldDataInterface,
	TextareaFieldDataInterface
} from '../../index'
import {Component, Input} from '@angular/core'

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
