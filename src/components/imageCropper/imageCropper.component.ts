import {ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild} from '@angular/core'
import {
	ImageCropperComponentOptionsInterface,
	ImageCropperComponentOutputInterface
} from './imageCropper.interfaces'

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
	croppedAreaWidth: number = 0
	croppedAreaX: number = 0
	croppedAreaY: number = 0
	currentZoomLevel: number = 1
	downPointX: number = 0
	downPointY: number = 0
	hoverBoxSize: number = 5
	imageObject: HTMLImageElement
	lastPointX: number = 0
	lastPointY: number = 0
	mouseIsDown: boolean = false
	resize: boolean = false
	sourceHeight: number = 0
	sourceWidth: number = 0
	sourceX: number = 0
	sourceY: number = 0

	@ViewChild('imageCanvas') imageCanvasRef: ElementRef<HTMLCanvasElement>

	@Output() imageCropped = new EventEmitter<ImageCropperComponentOutputInterface>()

	constructor(
		public changeDetectorRef: ChangeDetectorRef
	) {
	}

	ngOnInit(): void {
		setTimeout(
			() => {
				this.canvasContext = this.imageCanvasRef.nativeElement.getContext('2d')
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
			height: this.croppedAreaHeight,
			isRound: this.options.croppedAreaIsRound,
			startX: this.croppedAreaX,
			startY: this.croppedAreaY,
			width: this.croppedAreaWidth
		})
	}

	drawImage(reset?: boolean): void {
		const {
				canvasBackgroundColor,
				canvasContext,
				imageObject
			} = this,
			{height, width} = imageObject,
			{clientHeight, clientWidth} = canvasContext.canvas
		canvasContext.fillStyle = this.canvasBackgroundColor
		canvasContext.fillRect(0, 0, clientWidth, clientHeight)
		if (reset) {
			this.sourceHeight = clientHeight
			this.sourceWidth = clientWidth
			this.sourceX = 0
			this.sourceY = 0
			// handle smaller images - zoom in the center of the image
			if ((width < clientWidth) || (height < clientHeight)) {
				this.currentZoomLevel = Math.min(width, height) / Math.min(clientWidth, clientHeight)
				this.sourceWidth *= this.currentZoomLevel
				this.sourceHeight *= this.currentZoomLevel
			}
			// handle bigger images - use an area equal to the canvas size from the center of the image
			else if ((height > clientHeight) || (width > clientWidth)) {
				this.currentZoomLevel = Math.min(clientWidth, clientHeight) / Math.min(width, height)
			}
			this.sourceX = (width - this.sourceWidth) / 2
			this.sourceY = (height - this.sourceHeight) / 2
			// console.log(width, this.sourceWidth, this.currentZoomLevel)
			// this.sourceX = -this.sourceWidth / 2
			// this.sourceY = (this.sourceHeight / 2)
		}
		// move the image by the amount of pixels the mouse has moved
		if (this.mouseIsDown) {
			let 
				croppedAreaWidthOnSource = this.croppedAreaWidth * this.currentZoomLevel,
				croppedAreaHeightOnSource = this.croppedAreaHeight * this.currentZoomLevel,
				maxX = (this.sourceWidth - croppedAreaWidthOnSource) / 2,
				// maxX = ((width - this.sourceWidth) / 2) + croppedAreaWidthOnSource,
				maxY = (this.sourceHeight - croppedAreaHeightOnSource) / 2,
				minX = (croppedAreaWidthOnSource - this.sourceWidth) / 2 + (1 * this.currentZoomLevel),
				minY = (croppedAreaHeightOnSource - this.sourceHeight) / 2 + (1 * this.currentZoomLevel)
			this.sourceX -= ((this.lastPointX - this.downPointX) / 2)
			if (this.sourceX > maxX) {
				this.sourceX = maxX
			} else if (this.sourceX < minX) {
				this.sourceX = minX
			}
			this.sourceY -= ((this.lastPointY - this.downPointY) / 2)
			if (this.sourceY > maxY) {
				this.sourceY = maxY
			} else if (this.sourceY < minY) {
				this.sourceY = minY
			}
			// console.log(`canvas width: ${clientWidth}, croppedAreaWidth: ${this.croppedAreaWidth}, minX: ${minX}`)
			// console.log(`movement by ${(this.lastPointX - this.downPointX) / 2}x${(this.lastPointY - this.downPointY) / 2}px to (${this.sourceX}, ${this.sourceY}) on source size ${this.sourceWidth}x${this.sourceHeight}, width maxX of ${maxX}`)
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
		let canvas = this.canvasContext.canvas
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
			this.croppedAreaX = (canvas.width - this.croppedAreaWidth) / 2
			this.croppedAreaY = (canvas.height - this.croppedAreaHeight) / 2
			// console.log(this.croppedAreaWidth, this.croppedAreaHeight)
		}
		this.canvasContext.strokeStyle = '#000000'
		this.canvasContext.lineWidth = 1
		this.canvasContext.globalAlpha = 1
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
			this.canvasContext.save()
			// initial clipping pattern
			this.canvasContext.beginPath()
			this.canvasContext.ellipse.apply(this.canvasContext, ellipseArgs)
			this.canvasContext.closePath()
			this.canvasContext.clip()
			// draw the image
			this.canvasContext.drawImage.apply(this.canvasContext, imageArgs)
			this.canvasContext.beginPath()
			this.canvasContext.clip()
			this.canvasContext.closePath()
			this.canvasContext.restore()
			this.canvasContext.beginPath()
			this.canvasContext.ellipse.apply(this.canvasContext, ellipseArgs)
			this.canvasContext.closePath()
			this.canvasContext.stroke()
		}
		else {
			let rectArgs = [this.croppedAreaX, this.croppedAreaY, this.croppedAreaWidth, this.croppedAreaHeight]
			this.canvasContext.save()
			this.canvasContext.beginPath()
			this.canvasContext.rect.apply(this.canvasContext, rectArgs)
			this.canvasContext.closePath()
			this.canvasContext.clip()
			this.canvasContext.drawImage.apply(this.canvasContext, imageArgs)
			this.canvasContext.beginPath()
			this.canvasContext.rect.apply(this.canvasContext, rectArgs)
			this.canvasContext.clip()
			this.canvasContext.closePath()
			this.canvasContext.restore()
			this.canvasContext.strokeRect.apply(this.canvasContext, rectArgs)
		}
	}

	loadImage(): Promise<any> {
		let instance = this
		return new Promise((resolve, reject) => {
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
				// instance.canvasContext.canvas.width = instance.imageObject.width
				// instance.canvasContext.canvas.height = instance.imageObject.height
				resolve(true)
			}
			this.imageObject.src = this.src
		})
	}

	onMouseDown(event: MouseEvent): void {
		event.preventDefault()
		let mouseCoordinates = this.windowToCanvas(event.clientX, event.clientY)
		this.mouseIsDown = true
		this.downPointX = mouseCoordinates.x
		this.downPointY = mouseCoordinates.y
		this.lastPointX = mouseCoordinates.x
		this.lastPointY = mouseCoordinates.y
	}

	onMouseMove(event: MouseEvent): void {
		event.preventDefault()
		if (this.mouseIsDown) {
			let mouseCoordinates = this.windowToCanvas(event.clientX, event.clientY)
			this.lastPointX = mouseCoordinates.x
			this.lastPointY = mouseCoordinates.y
			this.reDrawCanvas()
		}
	}

	@HostListener('window:mouseup', ['$event'])
	onMouseUp(event: MouseEvent): void {
		if (!this.mouseIsDown) {
			return
		}
		event.preventDefault()
		this.mouseIsDown = false
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
