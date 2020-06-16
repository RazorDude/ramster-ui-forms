import {AutocompleteFieldDataInterface} from '../../autocomplete.interfaces'
import {BaseAutocompleteComponent} from '../../base/baseAutocomplete.component'
import {ChangeDetectorRef, Component} from '@angular/core'
import {MatDialogRef} from '@angular/material'

@Component({
	selector: 'autocomplete-mobile-modal',
	templateUrl: './mobileModal.template.html',
	styleUrls: ['./mobileModal.styles.css']
})
export class AutocompleteMobileModalComponent extends BaseAutocompleteComponent {
	data: {
		fieldData: AutocompleteFieldDataInterface
	}

	constructor(
		changeDetectorRef: ChangeDetectorRef,
		public dialogRef: MatDialogRef<AutocompleteMobileModalComponent>
	) {
		super(changeDetectorRef)
	}

	ngOnInit(): void {
		this.fieldData = this.data.fieldData
		super.ngOnInit()
	}

	closeModal(): void {
		this.dialogRef.close({fieldData: this.fieldData})
	}

	onFocus(event: Event): void {
		super.onFocus(event)
		setTimeout(
			() => {
				window.scrollTo(0, 0)
				document.body.scrollTop = 0
			},
			500
		)
	}

	onSelectionChange(event: any, value: any, index: number): boolean {
		setTimeout(
			() => {
				let result = super.onSelectionChange(event, value, index)
				if (result) {
					this.closeModal()
				}
			},
			500
		)
		return true
	}
}
