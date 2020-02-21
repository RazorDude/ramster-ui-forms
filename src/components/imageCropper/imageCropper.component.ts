import {ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core'
import {
	ImageCropperComponentOptionsInterface,
	ImageCropperComponentOutputInterface
} from './imageCropper.interfaces'
import {MatSliderChange} from '@angular/material'

@Component({
	selector: 'rui-image-cropper',
	styleUrls: ['./imageCropper.styles.css'],
	templateUrl: './imageCropper.template.html'
})
export class ImageCropperComponent implements OnInit, OnChanges {
	@Input() options: ImageCropperComponentOptionsInterface
	@Input() src: string

	buttonIsLoading: boolean = false
	canvasBackgroundColor: string = '#C0C0C0'
	canvasContext: CanvasRenderingContext2D = null
	click: boolean = false
	croppedAreaHeight: number = 0
	croppedAreaHeightOnSource: number = 0
	croppedAreaWidth: number = 0
	croppedAreaWidthOnSource: number = 0
	croppedAreaX: number = 0
	croppedAreaY: number = 0
	currentZoomLevel: number = 1
	downPointX: number = 0
	downPointY: number = 0
	hoverBoxSize: number = 5
	imageObject: HTMLImageElement
	multiTouchActive: boolean = false
	lastMovementTimestamp: number = 0
	lastPointX: number = 0
	lastPointY: number = 0
	lastDiffX: number = 0
	lastDiffY: number = 0
	mouseIsDown: boolean = false
	movementMaxSourceX: number = 0
	movementMaxSourceY: number = 0
	movementMinSourceX: number = 0
	movementMinSourceY: number = 0
	movementPixels: number = 5
	resize: boolean = false
	sourceHeight: number = 0
	sourceWidth: number = 0
	sourceX: number = 0
	sourceY: number = 0
	zoomMax: number = 1.9
	zoomMin: number = 0.1
	zoomSliderValue: number = 1
	zoomStep: number = 0.1

	@ViewChild('imageCanvas') imageCanvasRef: ElementRef<HTMLCanvasElement>
	@ViewChild('matSliderElement') matSliderElementRef: ElementRef<HTMLElement>

	@Output() imageCropped = new EventEmitter<ImageCropperComponentOutputInterface>()

	constructor(
		public changeDetectorRef: ChangeDetectorRef
	) {
	}

	ngOnInit(): void {
		setTimeout(
			() => {
				this.canvasContext = this.imageCanvasRef.nativeElement.getContext('2d')
				this.movementPixels = this.options && this.options.backgroundMovementSpeed || 5
				this.loadImage().then((result) => {
					if (result) {
						this.reDrawCanvas(true)
						this.changeDetectorRef.detectChanges()
					}
				})
			}
		)
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.options) {
			const {currentValue, previousValue} = changes.options
			this.movementPixels = currentValue && currentValue.backgroundMovementSpeed || 5
			if (
				this.canvasContext && (
					!previousValue ||
					(currentValue.croppedAreaHeight !== previousValue.croppedAreaHeight) ||
					(currentValue.croppedAreaWidth !== previousValue.croppedAreaWidth)
				)
			) {
				this.drawSelRect(true)
			}
		}
		if (changes.src) {
			const {currentValue, previousValue} = changes.src
			if (!previousValue || (currentValue !== previousValue)) {
				this.loadImage().then((result) => {
					if (result) {
						this.reDrawCanvas(true)
						this.changeDetectorRef.detectChanges()
					}
				})
			}
		}
	}

	changeZoomLevel(event: MatSliderChange | {[value: string]: number}): void {
		if ((event.value >= this.zoomMax) || (event.value < this.zoomMin)) {
			this.zoomSliderValue = this.zoomSliderValue
			if (this.matSliderElementRef.nativeElement) {
				this.matSliderElementRef.nativeElement.blur()
			}
			return
		}
		this.currentZoomLevel = this.currentZoomLevel - (event.value - this.zoomSliderValue)
		this.sourceWidth = this.canvasContext.canvas.clientWidth * this.currentZoomLevel
		this.sourceHeight = this.canvasContext.canvas.clientHeight * this.currentZoomLevel
		this.drawSelRect(true)
		this.mouseIsDown = true
		this.reDrawCanvas()
		this.zoomSliderValue = event.value
		this.mouseIsDown = false
		this.multiTouchActive = false
	}

	clearCanvas(): void {
		const {canvasBackgroundColor, canvasContext} = this,
			{canvas} = canvasContext
		canvas.width = canvas.clientWidth
		canvas.height = canvas.clientHeight
		canvasContext.clearRect(0, 0, canvas.width, canvas.height)
		canvasContext.fillStyle = canvasBackgroundColor
		canvasContext.fillRect(0, 0, canvas.width, canvas.height)
	}

	cropImage(): void {
		this.imageCropped.next({
			height: this.croppedAreaHeightOnSource,
			isRound: this.options.croppedAreaIsRound,
			startX: this.sourceX + ((this.sourceWidth - this.croppedAreaWidthOnSource) / 2),
			startY: this.sourceY + ((this.sourceHeight - this.croppedAreaHeightOnSource) / 2),
			width: this.croppedAreaWidthOnSource
		})
	}

	drawImage(reset?: boolean): void {
		const {
				canvasBackgroundColor,
				canvasContext,
				imageObject,
				mouseIsDown
			} = this,
			{height, width} = imageObject,
			{clientHeight, clientWidth} = canvasContext.canvas
		canvasContext.fillStyle = this.canvasBackgroundColor
		canvasContext.fillRect(0, 0, clientWidth, clientHeight)
		if (reset) {
			// handle smaller images - zoom in the center of the image
			if ((width < clientWidth) || (height < clientHeight)) {
				this.currentZoomLevel = Math.min(width, height) / Math.min(clientWidth, clientHeight)
				this.sourceWidth = clientWidth * this.currentZoomLevel
				this.sourceHeight = clientHeight * this.currentZoomLevel
			}
			// handle bigger images - use an area equal to the canvas size from the center of the image
			else {
				this.currentZoomLevel = 1
				this.sourceHeight = clientHeight
				this.sourceWidth = clientWidth
			}
			this.sourceX = (width - this.sourceWidth) / 2
			this.sourceY = (height - this.sourceHeight) / 2
		}
		// old: move the image by the amount of pixels the mouse has moved
		// new: move the image by a fixed amount if pixels in the direction the mouse have moved
		if (mouseIsDown) {
			const {
				downPointX,
				downPointY,
				lastDiffX,
				lastDiffY,
				lastPointX,
				lastPointY,
				movementMaxSourceX,
				movementMaxSourceY,
				movementMinSourceX,
				movementMinSourceY,
				movementPixels
			} = this
			// old
			// this.sourceX -= ((lastPointX - downPointX) / 2)
			let xDiff = lastPointX - downPointX
			this.sourceX += xDiff < lastDiffX ? movementPixels : -movementPixels
			this.lastDiffX = xDiff
			if (this.sourceX > movementMaxSourceX) {
				this.sourceX = movementMaxSourceX
			} else if (this.sourceX < movementMinSourceX) {
				this.sourceX = movementMinSourceX
			}
			// old:
			// this.sourceY -= ((lastPointY - downPointY) / 2)
			let yDiff = lastPointY - downPointY
			this.sourceY += yDiff < lastDiffY ? movementPixels : -movementPixels
			this.lastDiffY = yDiff
			if (this.sourceY > movementMaxSourceY) {
				this.sourceY = movementMaxSourceY
			} else if (this.sourceY < movementMinSourceY) {
				this.sourceY = movementMinSourceY
			}
			// console.log(this.sourceX, this.sourceY)
		}
		// draw the faded background and image
		this.canvasContext.globalAlpha = 0.6
		canvasContext.fillStyle = canvasBackgroundColor
		canvasContext.fillRect(0, 0, clientWidth, clientHeight)
		this.canvasContext.drawImage(
			this.imageObject,
			this.sourceX, this.sourceY, // source start position
			this.sourceWidth, this.sourceHeight, // source dimensions
			0, 0, // destination start position
			clientWidth, clientHeight // destination dimensions - use the canvas dimensions
		)
	}

	drawSelRect(reset?: boolean): void {
		const {
			canvasContext,
			imageObject
		} = this
		let canvas = canvasContext.canvas
		if (reset && this.options) {
			const {croppedAreaHeight, croppedAreaWidth} = this.options
			if (croppedAreaWidth.match(/%$/)) {
				this.croppedAreaWidth = canvas.width * parseInt(croppedAreaWidth.replace(/[^0-9]/, ''), 10) / 100
			}
			else {
				this.croppedAreaWidth = parseInt(croppedAreaWidth.replace(/[^0-9]/, ''), 10)
			}
			if (croppedAreaHeight.match(/%$/)) {
				this.croppedAreaHeight = canvas.height * parseInt(croppedAreaHeight.replace(/[^0-9]/, ''), 10) / 100
			}
			else {
				this.croppedAreaHeight = parseInt(croppedAreaHeight.replace(/[^0-9]/, ''), 10)
			}
			if (this.croppedAreaWidth > canvas.width) {
				this.croppedAreaWidth = canvas.width - 10
			}
			if (this.croppedAreaHeight > canvas.height) {
				this.croppedAreaHeight = canvas.height - 10
			}
			if (this.options && this.options.croppedAreaDimensionsAreEqual) {
				this.croppedAreaWidth = Math.min(this.croppedAreaWidth, this.croppedAreaHeight)
				this.croppedAreaHeight = Math.min(this.croppedAreaWidth, this.croppedAreaHeight)
			}
			let borderWidth = (1 * this.currentZoomLevel)
			this.croppedAreaX = (canvas.width - this.croppedAreaWidth) / 2
			this.croppedAreaY = (canvas.height - this.croppedAreaHeight) / 2
			this.croppedAreaWidthOnSource = this.croppedAreaWidth * this.currentZoomLevel
			this.croppedAreaHeightOnSource = this.croppedAreaHeight * this.currentZoomLevel
			this.movementMaxSourceX = (this.sourceWidth * (imageObject.width / this.sourceWidth)) - (this.sourceWidth / 2) - (this.croppedAreaWidthOnSource / 2) - borderWidth,
			this.movementMaxSourceY = (this.sourceHeight * (imageObject.height / this.sourceHeight)) - (this.sourceHeight / 2) - (this.croppedAreaHeightOnSource / 2) - borderWidth,
			this.movementMinSourceX = ((-this.sourceWidth + this.croppedAreaWidthOnSource) / 2) + borderWidth,
			this.movementMinSourceY = ((-this.sourceHeight + this.croppedAreaHeightOnSource) / 2) + borderWidth
			this.zoomMax = +((Math.min(imageObject.width, imageObject.height) / Math.min(this.croppedAreaWidth, this.croppedAreaHeight)) - 0.05).toFixed(1)
			// this.zoomMax = +(Math.min(imageObject.width, imageObject.height) / Math.min(this.croppedAreaWidth, this.croppedAreaHeight)).toFixed(1)
			this.zoomSliderValue = this.zoomMax - 1
		}
		canvasContext.strokeStyle = '#000000'
		canvasContext.lineWidth = 1
		canvasContext.globalAlpha = 1
		let imageArgs = [
			this.imageObject,
			this.sourceX, this.sourceY, // source start position
			this.sourceWidth, this.sourceHeight, // source dimensions
			0, 0, // destination start position
			canvas.clientWidth, canvas.clientHeight // destination dimensions - use the canvas dimensions
		]
		if (this.options && this.options.croppedAreaIsRound) {
			let xRadius = this.croppedAreaWidth / 2,
				yRadius = this.croppedAreaHeight / 2,
				ellipseArgs = [
					this.croppedAreaX + xRadius,
					this.croppedAreaY + yRadius,
					xRadius,
					yRadius,
					0,
					0,
					2 * Math.PI
				]
			canvasContext.save()
			// initial clipping pattern
			canvasContext.beginPath()
			canvasContext.ellipse.apply(canvasContext, ellipseArgs)
			canvasContext.closePath()
			canvasContext.clip()
			// draw the image
			canvasContext.drawImage.apply(canvasContext, imageArgs)
			canvasContext.beginPath()
			canvasContext.clip()
			canvasContext.closePath()
			canvasContext.restore()
			canvasContext.beginPath()
			canvasContext.ellipse.apply(canvasContext, ellipseArgs)
			canvasContext.closePath()
			canvasContext.stroke()
		}
		else {
			let rectArgs = [this.croppedAreaX, this.croppedAreaY, this.croppedAreaWidth, this.croppedAreaHeight]
			canvasContext.save()
			canvasContext.beginPath()
			canvasContext.rect.apply(canvasContext, rectArgs)
			canvasContext.closePath()
			canvasContext.clip()
			canvasContext.drawImage.apply(canvasContext, imageArgs)
			canvasContext.beginPath()
			canvasContext.rect.apply(canvasContext, rectArgs)
			canvasContext.clip()
			canvasContext.closePath()
			canvasContext.restore()
			canvasContext.strokeRect.apply(canvasContext, rectArgs)
		}
	}

	loadImage(): Promise<any> {
		return new Promise((resolve) => {
			if (!this.src) {
				resolve(false)
				return
			}
			if (!this.imageCanvasRef || !this.imageCanvasRef.nativeElement) {
				resolve(false)
				return
			}
			this.imageObject = new Image()
			this.imageObject.onload = function() {
				resolve(true)
			}
			this.imageObject.src = this.src
		})
	}

	onMouseDown(event: MouseEvent): void {
		event.preventDefault()
		let mouseCoordinates = this.windowToCanvas(event.clientX, event.clientY)
		this.mouseIsDown = true
		this.multiTouchActive = false
		this.downPointX = mouseCoordinates.x
		this.downPointY = mouseCoordinates.y
		this.lastPointX = mouseCoordinates.x
		this.lastPointY = mouseCoordinates.y
	}

	@HostListener('window:mousemove', ['$event'])
	onMouseMove(event: MouseEvent): void {
		if (!this.mouseIsDown) {
			return
		}
		event.preventDefault()
		let mouseCoordinates = this.windowToCanvas(event.clientX, event.clientY)
		this.lastPointX = mouseCoordinates.x
		this.lastPointY = mouseCoordinates.y
		this.reDrawCanvas()
	}

	@HostListener('window:mouseup', ['$event'])
	onMouseUp(event: MouseEvent): void {
		if (!this.mouseIsDown) {
			return
		}
		event.preventDefault()
		this.mouseIsDown = false
		this.multiTouchActive = false
	}

	@HostListener('window:mousewheel', ['$event'])
	onMouseWheel(event: MouseWheelEvent): void {
		let newZoomSliderValue = event.deltaY < 0 ? this.zoomSliderValue + this.zoomStep : this.zoomSliderValue - this.zoomStep
		this.changeZoomLevel({value: newZoomSliderValue})
	}

	@HostListener('window:touchend', ['$event'])
	onTouchEnd(event: MouseEvent): void {
		if (!this.mouseIsDown) {
			return
		}
		event.preventDefault()
		if (this.multiTouchActive) {
			this.multiTouchActive = false
			return
		}
		this.mouseIsDown = false
	}

	@HostListener('window:touchmove', ['$event'])
	onTouchMove(event: TouchEvent): void {
		if (!this.mouseIsDown) {
			return
		}
		event.preventDefault()
		let {x, y} = this.windowToCanvas(event.touches[0].clientX, event.touches[0].clientY)
		this.lastPointX = x
		this.lastPointY = y
		// pinch to zoom
		if (this.multiTouchActive) {
			let xDiff = x - this.downPointX,
				yDiff = y - this.downPointY
			this.changeZoomLevel({value: ((xDiff < this.lastDiffX) || (yDiff < this.lastDiffY)) ? this.zoomSliderValue + this.zoomStep : this.zoomSliderValue - this.zoomStep})
			this.lastDiffX = xDiff
			this.lastDiffY = yDiff
			return
		}
		this.reDrawCanvas()
	}

	onTouchStart(event: TouchEvent): void {
		event.preventDefault()
		// pinch to zoom
		this.multiTouchActive = this.mouseIsDown ? true : false
		let mouseCoordinates = this.windowToCanvas(event.touches[0].clientX, event.touches[0].clientY)
		this.mouseIsDown = true
		this.downPointX = mouseCoordinates.x
		this.downPointY = mouseCoordinates.y
		this.lastPointX = mouseCoordinates.x
		this.lastPointY = mouseCoordinates.y
	}

	reDrawCanvas(reset?: boolean): void {
		this.clearCanvas()
		this.drawImage(reset)
		this.drawSelRect(reset)
	}

	windowToCanvas(x: number, y: number): {x: number, y: number} {
		let canvas = this.canvasContext.canvas,
			bbox = canvas.getBoundingClientRect()
		return {
			x: x - bbox.left * (canvas.clientWidth / bbox.width),
			y: y - bbox.top * (canvas.clientHeight / bbox.height)
		}
	}
}
