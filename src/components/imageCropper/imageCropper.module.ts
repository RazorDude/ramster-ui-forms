import {CommonModule} from '@angular/common'
import {ImageCropperComponent} from './imageCropper.component'
import {
	MatButtonModule,
	MatSliderModule
} from '@angular/material'
import {ModuleWithProviders, NgModule} from '@angular/core'

@NgModule({
	imports: [
		CommonModule,
		MatButtonModule,
		MatSliderModule
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
