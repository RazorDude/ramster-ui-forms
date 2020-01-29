export interface ImageCropperComponentOptionsInterface {
	croppedAreaDimensionsAreEqual?: boolean
	croppedAreaHeight?: string
	croppedAreaIsRound?: boolean
	croppedAreaWidth?: string
}

export interface ImageCropperComponentOutputInterface {
	height: number
	isRound: boolean
	startX: number
	startY: number
	width: number
}
