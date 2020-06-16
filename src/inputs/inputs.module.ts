import {CommonModule} from '@angular/common'
import {ImageCropperModule} from '../components/imageCropper/imageCropper.module'
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
import {NgxWigModule} from 'ngx-wig'
import {ReactiveFormsModule} from '@angular/forms'

import {AutocompleteComponent} from './autocomplete/autocomplete.component'
import {AutocompleteMobileModalComponent, ReversePipe} from './autocomplete/components/mobileModal/mobileModal.component'
import {CheckboxComponent} from './checkbox/checkbox.component'
import {DatepickerComponent} from './datepicker/datepicker.component'
import {FileInputComponent} from './file/file.component'
import {FileInputImageCropperModalComponent} from './file/components/imageCropperModal/imageCropperModal.component'
import {InputComponent} from './input/input.component'
import {SelectComponent} from './select/select.component'
import {SlideToggleComponent} from './slideToggle/slideToggle.component'
import {TextareaComponent} from './textarea/textarea.component'
import {WysiwygComponent} from './wysiwyg/wysiwyg.component'

@NgModule({
	imports: [
		CommonModule,
		ImageCropperModule,
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
		NgxWigModule,
		ReactiveFormsModule
	],
	declarations: [
		AutocompleteComponent,
		AutocompleteMobileModalComponent,
		CheckboxComponent,
		DatepickerComponent,
		FileInputComponent,
		FileInputImageCropperModalComponent,
		InputComponent,
		ReversePipe,
		SelectComponent,
		SlideToggleComponent,
		TextareaComponent,
		WysiwygComponent
	],
	exports: [
		AutocompleteComponent,
		CheckboxComponent,
		DatepickerComponent,
		FileInputComponent,
		InputComponent,
		SelectComponent,
		SlideToggleComponent,
		TextareaComponent,
		WysiwygComponent
	],
	entryComponents: [
		AutocompleteMobileModalComponent,
		FileInputImageCropperModalComponent
	]
})
export class InputsModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: InputsModule,
			providers: []
		}
	}
}
