// angular dependencies
import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'

import {FormInjector} from './components/formInjector/formInjector.component'
import {InputInjector} from './components/inputInjector/inputInjector.component'
import {InputsModule} from './inputs/inputs.module'
import validators from './validators'

@NgModule({
	imports: [
		CommonModule,
		InputsModule
	],
	declarations: [
		FormInjector,
		InputInjector
	],
	exports: [
		FormInjector,
		InputInjector,
		InputsModule
	]
})
export class RamsterUIFormsModule {}

export {FormInjector, InputInjector, InputsModule, validators}
export * from './inputs/autocomplete/autocomplete.interfaces'
export * from './inputs/base/baseInput.component'
export * from './inputs/base/baseInput.interfaces'
export * from './inputs/checkbox/checkbox.interfaces'
export * from './inputs/datepicker/datepicker.interfaces'
export * from './inputs/file/file.interfaces'
export * from './inputs/input/input.interfaces'
export * from './inputs/select/select.interfaces'
export * from './inputs/slideToggle/slideToggle.interfaces'
export * from './inputs/textarea/textarea.interfaces'
export * from './inputs/wysiwyg/wysiwyg.interfaces'
export * from './services/formBuilder'
