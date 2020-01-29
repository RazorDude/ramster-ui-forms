import {Component, ChangeDetectionStrategy, Input} from '@angular/core'
import {GlobalEventsService} from 'ramster-ui-core'
import {
	ImageCropperComponentOptionsInterface,
	ImageCropperComponentOutputInterface
} from '../../../../components/imageCropper/imageCropper.interfaces'
import {MatDialogRef} from '@angular/material'

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'image-cropper-modal',
	templateUrl: './imageCropperModal.template.html',
	styleUrls: ['./imageCropperModal.styles.css']
})
export class FileInputImageCropperModalComponent {
	data: {
		fileUrl: string
		imageCropperOptions: ImageCropperComponentOptionsInterface
	}
	formIsLoading: boolean = false

	constructor(
		public dialogRef: MatDialogRef<FileInputImageCropperModalComponent>,
		public globalEventsService: GlobalEventsService,
	) {
	}

	ngOnInit(): void {
	}

	closeModal(event: ImageCropperComponentOutputInterface): void {
		this.dialogRef.close(event)
	}
}
