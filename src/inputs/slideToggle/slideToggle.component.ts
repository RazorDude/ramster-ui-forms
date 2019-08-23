import {BaseInputComponent} from '../base/baseInput.component'
import {Component, ElementRef, Input, ViewChild} from '@angular/core'
import {SlideToggleFieldDataInterface} from './slideToggle.interfaces'


@Component({
	selector: 'rui-slide-toggle',
	templateUrl: './slideToggle.template.html',
	styleUrls: ['../base/baseInput.styles.css']
})
export class SlideToggleComponent extends BaseInputComponent {
	@Input()
	fieldData: SlideToggleFieldDataInterface

	@ViewChild('inputElement') inputElementRef: ElementRef

	constructor() {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()

		if (this.fieldData.readOnly) {
			this.fieldData.inputFormControl.disable()
		}
	}
}
