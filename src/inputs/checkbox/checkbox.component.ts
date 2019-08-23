import {BaseInputComponent} from '../base/baseInput.component'
import {CheckboxFieldDataInterface} from './checkbox.interfaces'
import {Component, ElementRef, Input, ViewChild} from '@angular/core'


@Component({
	selector: 'rui-checkbox',
	templateUrl: './checkbox.template.html',
	styleUrls: ['../base/baseInput.styles.css']
})
export class CheckboxComponent extends BaseInputComponent {
	@Input()
	fieldData: CheckboxFieldDataInterface

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
