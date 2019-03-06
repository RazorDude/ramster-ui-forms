import {CommonModule} from '@angular/common'
import {ReactiveFormsModule} from '@angular/forms'
import {ModuleWithProviders, NgModule} from '@angular/core'
import {
	MatAutocompleteModule,
	MatButtonModule,
	MatCheckboxModule,
	MatChipsModule,
	MatDatepickerModule,
	MatFormFieldModule,
	MatIconModule,
	MatInputModule,
	MatNativeDateModule,
	MatSelectModule,
	MatSlideToggleModule
} from '@angular/material'

import {AutocompleteComponent} from './autocomplete/autocomplete.component'
import {CheckboxComponent} from './checkbox/checkbox.component'
import {DatepickerComponent} from './datepicker/datepicker.component'
import {FileInputComponent} from './file/file.component'
import {InputComponent} from './input/input.component'
import {SelectComponent} from './select/select.component'
import {SlideToggleComponent} from './slideToggle/slideToggle.component'
import {TextareaComponent} from './textarea/textarea.component'

@NgModule({
	imports: [
		CommonModule,
		MatAutocompleteModule,
		MatButtonModule,
		MatCheckboxModule,
		MatChipsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatNativeDateModule,
		MatSelectModule,
		MatSlideToggleModule,
		ReactiveFormsModule
	],
	declarations: [
		AutocompleteComponent,
		CheckboxComponent,
		DatepickerComponent,
		FileInputComponent,
		InputComponent,
		SelectComponent,
		SlideToggleComponent,
		TextareaComponent
	],
	exports: [
		AutocompleteComponent,
		CheckboxComponent,
		DatepickerComponent,
		FileInputComponent,
		InputComponent,
		SelectComponent,
		SlideToggleComponent,
		TextareaComponent
	]
})
export class InputsModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: InputsModule,
			providers: [
			]
		}
	}
}