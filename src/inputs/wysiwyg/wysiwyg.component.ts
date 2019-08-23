import {BaseInputComponent} from '../base/baseInput.component'
import {Component, ElementRef, Input, ViewChild} from '@angular/core'
import {DEFAULT_LIBRARY_BUTTONS} from 'ngx-wig'
import {WysiwygFieldDataInterface} from './wysiwyg.interfaces'


@Component({
	selector: 'rui-wysiwyg',
	templateUrl: './wysiwyg.template.html',
	styleUrls: [
		'../base/baseInput.styles.css',
		'./wysiwyg.styles.css'
	]
})
export class WysiwygComponent extends BaseInputComponent {
	buttons: string

	@Input()
	fieldData: WysiwygFieldDataInterface

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
		this.buttons = Object.keys(DEFAULT_LIBRARY_BUTTONS).join(', ')
	}
}
