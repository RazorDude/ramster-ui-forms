import {BaseInputComponent} from '../base/baseInput.component'
import {Component, Input} from '@angular/core'
import {DatepickerFieldDataInterface} from './datepicker.interfaces'
import {MatDatepicker} from '@angular/material'


@Component({
	selector: 'rui-datepicker',
	templateUrl: './datepicker.template.html',
	styleUrls: ['../base/baseInput.styles.css']
})
export class DatepickerComponent extends BaseInputComponent {
	@Input()
	fieldData: DatepickerFieldDataInterface

	constructor() {
		super()
	}

	ngOnInit(): void {
		super.ngOnInit()
	}

	openCalendar(picker: MatDatepicker<Date>): void {
		if (this.fieldData.readOnly) {
			return
		}
		picker.open()
	}
}
