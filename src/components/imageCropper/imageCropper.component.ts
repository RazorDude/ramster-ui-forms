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
	canvasBackgroundColor: string = '#FFFFFF'
	canvasContext: CanvasRenderingContext2D = null
	click: boolean = false
	downPointX: number = 0
	downPointY: number = 0
	hoverBoxSize: number = 5
	imageObject: HTMLImageElement
	lastPointX: number = 0
	lastPointY: number = 0
	resize: boolean = false

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
		this.canvasContext.clearRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height)
		this.canvasContext.fillStyle = this.canvasBackgroundColor
		this.canvasContext.fillRect(0, 0, this.canvasContext.canvas.width, this.canvasContext.canvas.height)
	}

	cropImage(): void {
		this.imageCropped.next({
			height: this.lastPointY - this.downPointY,
			isRound: this.options.croppedAreaIsRound,
			startX: this.downPointX,
			startY: this.downPointY,
			width: this.lastPointX - this.downPointX
		})
	}

	drawImage(): void {
		this.canvasContext.globalAlpha = 0.6
		this.canvasContext.drawImage(this.imageObject, 0, 0)
	}

	drawResizerBoxes(): void {
		let centerPointX = (this.lastPointX + this.downPointX) / 2,
			centerPointY = (this.lastPointY + this.downPointY) / 2
		this.canvasContext.fillStyle = '#000000'
		this.canvasContext.lineWidth = 1
		this.canvasContext.fillRect(centerPointX - this.hoverBoxSize, this.downPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2)
		this.canvasContext.fillRect(this.lastPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2)
		this.canvasContext.fillRect(centerPointX - this.hoverBoxSize, this.lastPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2)
		this.canvasContext.fillRect(this.downPointX - this.hoverBoxSize, centerPointY - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2)
	}

	drawSelRect(reset?: boolean): void {
		let canvas = this.canvasContext.canvas,
			height = null,
			width = null
		if (reset && this.options) {
			const {croppedAreaHeight, croppedAreaWidth} = this.options
			if (croppedAreaWidth.match(/%$/)) {
				width = canvas.width * parseInt(croppedAreaWidth.replace(/[^0-9]/, ''), 10) / 100
			}
			else {
				width = parseInt(croppedAreaWidth.replace(/[^0-9]/, ''), 10)
			}
			if (croppedAreaHeight.match(/%$/)) {
				height = canvas.height * parseInt(croppedAreaHeight.replace(/[^0-9]/, ''), 10) / 100
			}
			else {
				height = parseInt(croppedAreaHeight.replace(/[^0-9]/, ''), 10)
			}
			this.downPointX = (canvas.width - width) / 2
			this.downPointY = (canvas.height - height) / 2
			this.lastPointX = this.downPointX + width
			this.lastPointY = this.downPointY + height
		} else {
			height = this.lastPointY - this.downPointY
			width = this.lastPointX - this.downPointX
		}
		if (height > canvas.height) {
			height = canvas.height - 10
			this.lastPointY = this.downPointY + height
		}
		if (width > canvas.width) {
			width = canvas.width - 10
			this.lastPointX = this.downPointX + width
		}
		if (this.enforceEqualCroppedAreaDimensions()) {
			height = this.lastPointY - this.downPointY
			width = this.lastPointX - this.downPointX
		}
		this.canvasContext.strokeStyle = '#000000'
		this.canvasContext.lineWidth = 1
		this.canvasContext.globalAlpha = 1
		if (this.options && this.options.croppedAreaIsRound) {
			let xRadius = width / 2,
				yRadius = height / 2
			if ((xRadius < 0) || (yRadius < 0)) {
				return
			}
			this.canvasContext.save()
			// initial clipping pattern
			this.canvasContext.beginPath()
			this.canvasContext.ellipse(
				this.downPointX + xRadius,
				this.downPointY + yRadius,
				xRadius,
				yRadius,
				0,
				0,
				2 * Math.PI
			)
			this.canvasContext.closePath()
			this.canvasContext.clip()
			// draw the image
			this.canvasContext.drawImage(
				this.imageObject,
				this.downPointX,
				this.downPointY,
				width,
				height,
				this.downPointX,
				this.downPointY,
				width,
				height
			)
			this.canvasContext.beginPath()
			this.canvasContext.ellipse(
				this.downPointX + xRadius,
				this.downPointY + yRadius,
				xRadius,
				yRadius,
				0,
				0,
				2 * Math.PI
			)
			this.canvasContext.clip()
			this.canvasContext.closePath()
			this.canvasContext.restore()
			// this.canvasContext.stroke()
		}
		else {
			this.canvasContext.strokeRect(this.downPointX, this.downPointY, width, height)
			this.canvasContext.drawImage(
				this.imageObject,
				this.downPointX,
				this.downPointY,
				width,
				height,
				this.downPointX,
				this.downPointY + 1,
				width - 1,
				height - 2
			)
		}
	}

	enforceEqualCroppedAreaDimensions(): boolean {
		if (this.options && this.options.croppedAreaDimensionsAreEqual) {
			let height = this.lastPointY - this.downPointY,
				width = this.lastPointX - this.downPointX
			if (height < width) {
				this.lastPointY = this.downPointY + width
				return true
			}
			if (width < height) {
				this.lastPointX = this.downPointX + height
				return true
			}
		}
		return false
	}

	isResizeBoxHover(loc: {x: number, y: number}, xPoint: number, yPoint: number): boolean {
		let hoverMargin = 3
		if (
			(loc.x > (xPoint - this.hoverBoxSize - hoverMargin)) &&
			(loc.x < (xPoint + this.hoverBoxSize + hoverMargin)) &&
			(loc.y > (yPoint - this.hoverBoxSize - hoverMargin)) &&
			(loc.y < (yPoint + 5 + hoverMargin))
		) {
			this.canvasContext.fillRect(xPoint - this.hoverBoxSize, yPoint - this.hoverBoxSize, this.hoverBoxSize * 2, this.hoverBoxSize * 2)
			this.resize = true
			return true
		}
		return false
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
				instance.canvasContext.canvas.width = instance.imageObject.width
				instance.canvasContext.canvas.height = instance.imageObject.height
				resolve(true)
			}
			this.imageObject.src = this.src
		})
	}

	onImageResize(event: any): void {
		let centerPointX = (this.lastPointX + this.downPointX) / 2,
			centerPointY = (this.lastPointY + this.downPointY) / 2,
			loc = this.windowToCanvas(event.clientX, event.clientY)
		this.canvasContext.fillStyle = '#FF0000'
		this.canvasContext.lineWidth = 1
		if (this.isResizeBoxHover(loc, centerPointX, this.downPointY)) {
			if (this.click) {
				this.downPointY = loc.y
				this.enforceEqualCroppedAreaDimensions()
				this.reDrawCanvas()
			}
		} else if (this.isResizeBoxHover(loc, this.lastPointX, centerPointY)) {
			if (this.click) {
				this.lastPointX = loc.x
				this.enforceEqualCroppedAreaDimensions()
				this.reDrawCanvas()
			}
		} else if (this.isResizeBoxHover(loc, centerPointX, this.lastPointY)) {
			if (this.click) {
				this.lastPointY = loc.y
				this.enforceEqualCroppedAreaDimensions()
				this.reDrawCanvas()
			}
		} else if (this.isResizeBoxHover(loc, this.downPointX, centerPointY)) {
			if (this.click) {
				this.downPointX = loc.x
				this.enforceEqualCroppedAreaDimensions()
				this.reDrawCanvas()
			}
		} else {
			this.resize = false
			this.reDrawCanvas()
		}
	}

	onMouseDown(event: any): void {
		event.preventDefault()
		let loc = this.windowToCanvas(event.clientX, event.clientY)
		this.click = true
		if (!this.resize) {
			this.canvasContext.canvas.onmousemove = this.onMouseMove.bind(this)
			this.downPointX = loc.x
			this.downPointY = loc.y
			this.lastPointX = loc.x
			this.lastPointY = loc.y
		}
	}

	onMouseMove(event: any): void {
		event.preventDefault()
		if (this.click) {
			let loc = this.windowToCanvas(event.clientX, event.clientY)
			this.lastPointX = loc.x
			this.lastPointY = loc.y
			this.enforceEqualCroppedAreaDimensions()
			this.reDrawCanvas()
		}
	}

	@HostListener('window:mouseup', ['$event'])
	onMouseUp(event: MouseEvent): void {
		if (!this.click) {
			return
		}
		event.preventDefault()
		this.canvasContext.canvas.onmousemove = this.onImageResize.bind(this)
		this.click = false
	}

	reDrawCanvas(resizeSelRect?: boolean): void {
		this.clearCanvas()
		this.drawImage()
		this.drawSelRect(resizeSelRect)
		this.drawResizerBoxes()
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
