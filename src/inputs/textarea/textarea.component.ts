import {BaseInputComponent} from '../base/baseInput.component'
import {Component, ElementRef, Input, ViewChild} from '@angular/core'
import {TextareaFieldDataInterface} from './textarea.interfaces'


@Component({
	selector: 'rui-textarea',
	templateUrl: './textarea.template.html',
	styleUrls: ['../base/baseInput.styles.css']
})
export class TextareaComponent extends BaseInputComponent {
	@Input()
	fieldData: TextareaFieldDataInterface

	maxRows: number = 10
	minRows: number = 10

	@ViewChild('inputElement') inputElementRef: ElementRef

	constructor() {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()
		const {maxRows, minRows} = this.fieldData
		if (maxRows) {
			this.maxRows = maxRows
		}
		if (minRows) {
			this.minRows = minRows
		}
	}
}
