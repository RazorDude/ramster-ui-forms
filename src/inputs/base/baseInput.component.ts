import {BaseInputFieldDataInterface, BaseInputFormControlStateChangeSubjectDataInterface} from './baseInput.interfaces'
import {Input, OnDestroy, OnInit} from '@angular/core'
import {Subject} from 'rxjs'


export class BaseInputComponent implements OnInit, OnDestroy {
	errorMessages: {[x: string]: string} = {
		emailIsInUse: 'This email is already in use.',
		max: 'The provided value exceeds the maximum allowed value for this field.',
		maxLength: 'The provided value exceeds the maximum allowed length for this field.',
		min: 'The provided value is below the minimum allowed value for this field.',
		minLength: 'The provided value is below the minimum required length for this field.',
		notAValidEmail: 'Please enter a valid email.',
		required: 'This field is required.'
	}
	destroyed: boolean = false
	formControlStateChangeMethodNames = ['markAsDirty', 'markAsPending', 'markAsPristine', 'markAsTouched', 'markAsUntouched']
	formControlStateChangeSubject = new Subject<BaseInputFormControlStateChangeSubjectDataInterface>()
	JSObject: any = Object

	@Input()
	fieldData: BaseInputFieldDataInterface

	constructor() {
	}

	ngOnInit(): void {
		const {
			errorMessages,
			formControlStateChangeSubject,
			label,
			onChangeHandler,
			onChangeValueCheckTimeout,
			placeholder,
			usePlaceholderAsLabel
		} = this.fieldData
		let instance = this,
			{inputFormControl} = this.fieldData
		if (errorMessages) {
			for (const key in errorMessages) {
				this.errorMessages[key] = errorMessages[key]
			}
		}
		this.formControlStateChangeMethodNames.forEach((methodName) => {
			const originalMethod = inputFormControl[methodName].bind(inputFormControl)
			inputFormControl[methodName] = function() {
				let data: BaseInputFormControlStateChangeSubjectDataInterface = {methodName},
					fieldName = null
				if (methodName.match(/^markAs/)) {
					fieldName = methodName.replace(/^markAs/, '')
					data.previousValue = inputFormControl[fieldName]
				}
				originalMethod()
				if (fieldName) {
					data.newValue = inputFormControl[fieldName]
				}
				instance.formControlStateChangeSubject.next(data)
				if (formControlStateChangeSubject) {
					formControlStateChangeSubject.next(data)
				}
			}
		})
		if (onChangeHandler) {
			const timeout = typeof onChangeValueCheckTimeout === 'number' ? onChangeValueCheckTimeout : 500
			inputFormControl.valueChanges.subscribe((value) => {
				setTimeout(
					() => {
						if (value === inputFormControl.value) {
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

	ngOnDestroy(): void {
		this.destroyed = true
	}

	executeHintAction(): void {
		if (this.fieldData.hintAction) {
			this.fieldData.hintAction()
		}
	}
}
