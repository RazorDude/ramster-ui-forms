import {FormControl} from '@angular/forms'

export function objectNotEmpty(control: FormControl): {[x: string]: any} | null {
	return (typeof control.value === 'object') && (control.value !== null) && Object.keys(control.value).length ? null : {invalid: true}
}
