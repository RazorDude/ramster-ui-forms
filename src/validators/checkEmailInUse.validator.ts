import {FormControl} from '@angular/forms'

export function checkEmailInUse(userModelRESTService: any): Function {
	return (control: FormControl): Promise<{[x: string]: any} | null> => new Promise((resolve, reject) => {
		const currentValue = control.value
		setTimeout(
			() => {
				if (currentValue === control.value) {
					userModelRESTService.checkEmail({email: control.value}).then(
						(res) => {
							resolve(res.emailInUse ? {emailIsInUse: true} : null)
						},
						(err) => {
							console.error(err)
							reject(err)
						}
					)
					return
				}
				resolve(null)
			},
			500
		)
	})
}
