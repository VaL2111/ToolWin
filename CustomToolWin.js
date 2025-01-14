import { ToolWin } from './ToolWin.js';

export class CustomToolWin extends ToolWin {
	constructor() {
		super();

		this.actions = {
			'Малювання точки': this.drawDot.bind(this),
			'Малювання лінії': this.drawLine.bind(this),
			'Малювання прямокутника': this.drawRectangle.bind(this),
			'Малювання еліпса': this.drawEllipse.bind(this),
			'Малювання круга': this.drawCircle.bind(this),
			'Інструмент заливання': this.enableFill.bind(this),
			'Інструмент ластик': this.enableEraser.bind(this),
			'Переміщення об\'єкту': this.enableMoveObject.bind(this),
			'Інструмент збільшення': this.enableZoomIn.bind(this),
			'Інструмент зменшення': this.enableZoomOut.bind(this),
			'Скасування останньої дії': this.enableUndo.bind(this),
			'Зміна кольору': this.enableColorChange.bind(this),
			'Зміна товщини': this.enableThicknessChange.bind(this),
			'Очищення': this.enableClear.bind(this),
		};

		this.shapes = [];
		this.activeButton = null;
		this.activeDrawHandler = null;
	}

	drawDot(event) {
		const canvas = document.getElementById('drawingCanvas');
		const ctx = canvas.getContext('2d');

		const rect = canvas.getBoundingClientRect();
		const x = event.clientX - rect.left;
		const y = event.clientY - rect.top;

		ctx.beginPath();
		ctx.arc(x, y, 2, 0, 2 * Math.PI);
		ctx.fillStyle = 'black';
		ctx.fill();

		this.shapes.push({ type: 'dot', x, y });

		console.log('Точка малюється.', { x, y });
		console.log('Список фігур:', this.shapes);
	}

	drawLine() {
		const canvas = document.getElementById('drawingCanvas');
		const ctx = canvas.getContext('2d');
		
		let isDrawing = false;
		let startX = null, startY = null;
		let endX = null, endY = null;
		
		const onMouseDown = (event) => {
			const rect = canvas.getBoundingClientRect();
			startX = event.clientX - rect.left;
			startY = event.clientY - rect.top;
			
			isDrawing = true;
		};
	
		const onMouseMove = (event) => {
			if (!isDrawing) return;
	
			const rect = canvas.getBoundingClientRect();
			endX = event.clientX - rect.left;
			endY = event.clientY - rect.top;
	
			// Малюємо гумовий слід
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			this.redrawShapes(ctx);
			if (startX !== null && startY !== null) {
				ctx.beginPath();
				ctx.moveTo(startX, startY);
				ctx.lineTo(endX, endY);
				ctx.strokeStyle = 'red';
				ctx.lineWidth = 1;
				ctx.stroke();
			}
		};
	
		const onMouseUp = (event) => {
			if (!isDrawing) return;
			
			isDrawing = false;
	
			const rect = canvas.getBoundingClientRect();
			endX = event.clientX - rect.left;
			endY = event.clientY - rect.top;
	
			// Малюємо фінальну лінію, якщо стартові координати встановлені
			if (startX !== null && startY !== null) {
				ctx.beginPath();
				ctx.moveTo(startX, startY);
				ctx.lineTo(endX, endY);
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 2;
				ctx.stroke();
	
				this.shapes.push({
					type: 'line',
					startX,
					startY,
					endX,
					endY,
				});
	
				console.log('Лінія намальована.', { startX, startY, endX, endY });
				console.log('Список фігур:', this.shapes);
			}
	
			startX = null;
			startY = null;
			endX = null;
			endY = null;
			
			canvas.removeEventListener('mousedown', onMouseDown);
			canvas.removeEventListener('mousemove', onMouseMove);
			canvas.removeEventListener('mouseup', onMouseUp);
		};
	
		canvas.addEventListener('mousedown', onMouseDown);
		canvas.addEventListener('mousemove', onMouseMove);
		canvas.addEventListener('mouseup', onMouseUp);
	}
  
	drawRectangle() {
		console.log('Прямокутник малюється.');
	}

	drawEllipse() {
		console.log('Еліпс малюється.');
	}

	drawCircle() {
		console.log('Круг малюється.');
	}

	redrawShapes(ctx) {
		this.shapes.forEach(shape => {
			if (shape.type === 'dot') {
				ctx.beginPath();
				ctx.arc(shape.x, shape.y, 2, 0, 2 * Math.PI);
				ctx.fillStyle = 'black';
				ctx.fill();
			}
			if (shape.type === 'line') {
				ctx.beginPath();
				ctx.moveTo(shape.startX, shape.startY);
				ctx.lineTo(shape.endX, shape.endY);
				ctx.strokeStyle = 'black';
				ctx.lineWidth = 2;
				ctx.stroke();
			}
			// Інші типи фігур можна додати сюди (наприклад, точки, прямокутники тощо)
		});
	}

	enableFill() {
		console.log('Інструмент заливання виконується.');
	}

	enableEraser() {
		console.log('Інструмент ластик виконується.');
	}

	enableMoveObject() {
		console.log('Переміщення об\'єкту виконується.');
	}

	enableZoomIn() {
		console.log('Інструмент збільшення виконується.');
	}

	enableZoomOut() {
		console.log('Інструмент зменшення виконується.');
	}

	enableUndo() {
		console.log('Скасування останньої дії виконується.');
	}

	enableColorChange() {
		console.log('Зміна кольору виконується.');
	}

	enableThicknessChange() {
		console.log('Зміна товщини виконується.');
	}

	enableClear() {
		console.log('Очищення виконується.');
	}

	toggleButton(buttonName) {
		const canvas = document.getElementById('drawingCanvas');

		const clearEventListeners = () => {
			canvas.removeEventListener('mousedown', this.activeDrawHandler);
			canvas.removeEventListener('mousemove', this.activeDrawHandler);
			canvas.removeEventListener('mouseup', this.activeDrawHandler);
			canvas.removeEventListener('click', this.activeDrawHandler);
		};

		if (this.activeButton === buttonName) {
			canvas.removeEventListener('click', this.activeDrawHandler);
			console.log(`${this.activeButton} деактивовано.`);
			
			this.activeButton = null;
			this.activeDrawHandler = null;

			return;
		}

		// Якщо натискається інша кнопка, спочатку деактивуємо попередню
		if (this.activeDrawHandler) {
			clearEventListeners();
			console.log(`${this.activeButton} деактивовано.`);
		}

		// Активуємо нову кнопку
		this.activeButton = buttonName;
		this.activeDrawHandler = this.actions[buttonName];

		canvas.addEventListener('click', this.activeDrawHandler);

		console.log(`${buttonName} активовано.`);
	}

	createToolWinWithActions(nx, ny, buttonSize, images, tooltips) {
		super.createToolWin(nx, ny, buttonSize, images, tooltips);

		const buttons = document.querySelectorAll('#button-container button');

		buttons.forEach((button, index) => {
			const tooltip = tooltips[index];
			button.addEventListener('click', () => this.toggleButton(tooltip));
		});
	}
}

