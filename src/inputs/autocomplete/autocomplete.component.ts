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
	focusLocked: boolean
	removeFocusLockOnNextTick: boolean

	constructor(
		changeDetectorRef: ChangeDetectorRef,
		public dialogRef: MatDialog
	) {
		super(changeDetectorRef)
	}

	ngOnInit(): void {
		super.ngOnInit()
		this.focusLocked = false
	}

	onFocus(event: Event): void {
		// console.log(this.focusLocked)
		if (this.focusLocked) {
			event.preventDefault()
			if (this.removeFocusLockOnNextTick) {
				this.focusLocked = false
				this.removeFocusLockOnNextTick = false
			}
			return
		}
		if (this.fieldData.isMobile) {
			event.preventDefault()
			this.blurLocked = true
			// this.focusLocked = true
			this.removeFocusLockOnNextTick = false
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
			this.subscriptions.push(dialogRef.afterClosed().subscribe((data) => {
				if (this.autocompleteSearchBoxRef) {
					this.autocompleteSearchBoxRef.nativeElement.blur()
				}
				if (this.chipSearchBox) {
					this.chipSearchBox.nativeElement.blur()
				}
				this.removeFocusLockOnNextTick = true
				this.blurLocked = false
				// setTimeout(
				// 	() => {
				// 		this.focusLocked = false
				// 	},
				// 	250
				// )
			}))
			return
		}
		super.onFocus(event)
	}
}
