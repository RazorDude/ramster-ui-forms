import {Input, OnInit} from '@angular/core'

import {BaseInputFieldDataInterface} from './baseInput.interfaces'


export class BaseInputComponent implements OnInit {
	@Input()
	fieldData: BaseInputFieldDataInterface

	errorMessages: {[x: string]: string} = {
		emailIsInUse: 'This email is already in use.',
		max: 'The provided value exceeds the maximum allowed value for this field.',
		maxLength: 'The provided value exceeds the maximum allowed length for this field.',
		min: 'The provided value is below the minimum allowed value for this field.',
		minLength: 'The provided value is below the minimum required length for this field.',
		notAValidEmail: 'Please enter a valid email.',
		required: 'This field is required.'
	}
	JSObject: any = Object


	constructor() {
	}

	ngOnInit(): void {
		const {
			errorMessages,
			label,
			onChangeHandler,
			onChangeValueCheckTimeout,
			placeholder,
			usePlaceholderAsLabel
		} = this.fieldData
		if (errorMessages) {
			for (const key in errorMessages) {
				this.errorMessages[key] = errorMessages[key]
			}
		}
		if (onChangeHandler) {
			const timeout = typeof onChangeValueCheckTimeout === 'number' ? onChangeValueCheckTimeout : 500
			this.fieldData.inputFormControl.valueChanges.subscribe((value) => {
				setTimeout(
					() => {
						if (value === this.fieldData.inputFormControl.value) {
							onChangeHandler.next({value})
						}
					},
					timeout
				)
			})
		}
		if (usePlaceholderAsLabel && !label) {
			this.fieldData.label = placeholder
		}
	}

	executeHintAction(): void {
		if (this.fieldData.hintAction) {
			this.fieldData.hintAction()
		}
	}
}
