import {FormControl} from '@angular/forms'

export function arrayNotEmpty(control: FormControl): {[x: string]: any} | null {
	return (control.value instanceof Array) && control.value.length ? null : {invalid: true}
}
