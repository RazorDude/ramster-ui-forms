import {Component, Input} from '@angular/core'

import {BaseInputComponent} from '../base/baseInput.component'
import {SlideToggleFieldDataInterface} from './slideToggle.interfaces'


@Component({
	selector: 'rui-slide-toggle',
	templateUrl: './slideToggle.template.html',
	styleUrls: ['../base/baseInput.styles.css']
})
export class SlideToggleComponent extends BaseInputComponent {
	@Input()
	fieldData: SlideToggleFieldDataInterface


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
