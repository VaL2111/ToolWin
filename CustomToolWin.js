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

		this.activeButton = null;
		this.activeDrawHandler = null;
	}

	drawDot() {
		console.log('Точка малюється.');
	}

	drawLine() {
		console.log('Лінія малюється.');
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

		if (this.activeButton === buttonName) {
			canvas.removeEventListener('click', this.activeDrawHandler);
			console.log(`${this.activeButton} деактивовано.`);
			
			this.activeButton = null;
			this.activeDrawHandler = null;

			return;
		}

		// Якщо натискається інша кнопка, спочатку деактивуємо попередню
		if (this.activeDrawHandler) {
			canvas.removeEventListener('click', this.activeDrawHandler);
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

