'use strict'

// angular dependencies
import {CommonModule} from '@angular/common'
import {NgModule} from '@angular/core'

import {InputsModule} from './inputs/inputs.module'
import validators from './validators'

@NgModule({
	imports: [
		CommonModule,
		InputsModule
	],
	exports: [InputsModule]
})
export class RamsterUIFormsModule {}

export {InputsModule, validators}
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
