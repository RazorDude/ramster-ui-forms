import {BaseInputComponent} from '../base/baseInput.component'
import {Component, ElementRef, Input, ViewChild} from '@angular/core'
import {InputFieldDataInterface} from './input.interfaces'


@Component({
	selector: 'rui-input',
	templateUrl: './input.template.html',
	styleUrls: ['../base/baseInput.styles.css']
})
export class InputComponent extends BaseInputComponent {
	@Input()
	fieldData: InputFieldDataInterface

	@ViewChild('inputElement') inputElementRef: ElementRef<HTMLInputElement>

	constructor() {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()
	}
}
