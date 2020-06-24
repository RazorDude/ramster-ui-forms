import {AutocompleteMobileModalComponent} from './components/mobileModal/mobileModal.component'
import {BaseAutocompleteComponent} from './base/baseAutocomplete.component'
import {ChangeDetectorRef, Component} from '@angular/core'
import {MatDialog} from '@angular/material'

@Component({
	selector: 'rui-autocomplete',
	templateUrl: './autocomplete.template.html',
	styleUrls: [
		'../base/baseInput.styles.css'
	]
})
export class AutocompleteComponent extends BaseAutocompleteComponent {
	constructor(
		changeDetectorRef: ChangeDetectorRef,
		public dialogRef: MatDialog
	) {
		super(changeDetectorRef)
	}

	ngOnInit(): void {
		super.ngOnInit()
	}

	onFocus(event: Event): void {
		if (this.fieldData.isMobile) {
			event.preventDefault()
			this.blurLocked = true
			if (this.fieldData.hasChips) {
				this.chipSearchBox.nativeElement.blur()
			}
			else {
				this.autocompleteSearchBoxRef.nativeElement.blur()
			}
			let dialogRef = this.dialogRef.open(
				AutocompleteMobileModalComponent, {
					height: '100vh',
					maxHeight: '100vh',
					maxWidth: '100vw',
					width: '100vw'
				}
			)
			dialogRef.componentInstance.data = {fieldData: this.fieldData}
			this.subscriptions.push(dialogRef.afterClosed().subscribe(() => {
				this.blurLocked = false
			}))
			return
		}
		super.onFocus(event)
	}
}
