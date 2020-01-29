import {CommonModule} from '@angular/common'
import {ImageCropperComponent} from './imageCropper.component'
import {
	MatButtonModule
} from '@angular/material'
import {ModuleWithProviders, NgModule} from '@angular/core'

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule
	],
	declarations: [
		ImageCropperComponent
	],
	exports: [
		ImageCropperComponent
	],
	entryComponents: []
})
export class ImageCropperModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: ImageCropperModule,
			providers: []
		}
	}
}
