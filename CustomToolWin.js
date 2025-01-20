import { ToolWin } from "./ToolWin.js";

export class CustomToolWin extends ToolWin {
   #actions;
   #shapes;
   #activeButton;
   #activeDrawHandler;
   #canvas;
   #context;
	#color;
	#shapeTypes

   constructor() {
      super();

      this.#actions = {
         "Малювання точки": this.drawShapes.bind(this),
         "Малювання лінії": this.drawShapes.bind(this),
         "Малювання прямокутника": this.drawShapes.bind(this),
         "Малювання еліпса": this.drawShapes.bind(this),
         "Малювання круга": this.drawShapes.bind(this),
         "Інструмент заливання": this.enableFill.bind(this),
         "Інструмент ластик": this.enableEraser.bind(this),
         "Переміщення об'єкту": this.enableMoveObject.bind(this),
         "Інструмент збільшення": this.enableZoomIn.bind(this),
         "Інструмент зменшення": this.enableZoomOut.bind(this),
         "Скасування останньої дії": this.enableUndo.bind(this),
         "Зміна кольору": this.enableColorChange.bind(this),
         "Зміна товщини": this.enableThicknessChange.bind(this),
         "Очищення": this.enableClear.bind(this),
      };

      this.#shapes = [];
      this.#activeButton = null;
      this.#activeDrawHandler = null;
		this.#color = "black";
		this.#shapeTypes = {
			dot: "Малювання точки",
			line: "Малювання лінії",
			rectangle: "Малювання прямокутника",
			ellipse: "Малювання еліпса",
			circle: "Малювання круга",
		}

      this.#canvas = document.getElementById("drawingCanvas");
      this.#context = this.#canvas.getContext("2d");
   }

	drawShapes() {
		const canvas = this.#canvas;
      const ctx = this.#context;
      const shapes = this.#shapes;
		const color = this.#color;
		const shapeTypes = this.#shapeTypes;
		const currentShapeType = this.#activeButton;

      let isDrawing = false;
      let startX = null;
      let startY = null;
      let endX = null;
      let endY = null;

		const rect = canvas.getBoundingClientRect();

      const onMouseDown = (event) => {
         startX = event.clientX - rect.left;
         startY = event.clientY - rect.top;

         isDrawing = true;
      };

      const onMouseMove = (event) => {
         if (!isDrawing) return;

         endX = event.clientX - rect.left;
         endY = event.clientY - rect.top;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
         this.redrawShapes();

			const rubberFootprintColor = "red";

			if (startX !== null && startY !== null) {
				switch (currentShapeType) {
					case shapeTypes.dot:
						break;
					case shapeTypes.line:
						this.drawingLine(
							startX, 
							startY, 
							endX, 
							endY, 
							rubberFootprintColor
						);
						break;
					case shapeTypes.rectangle:
						const width = endX - startX;
            		const height = endY - startY;

            		this.drawingRectangle(
							startX, 
							startY, 
							width, 
							height, 
							rubberFootprintColor
						);
						break;
					case shapeTypes.ellipse:
						const centerEllipseX = (startX + endX) / 2;
						const centerEllipseY = (startY + endY) / 2;
						const radiusX = Math.abs(endX - startX) / 2;
						const radiusY = Math.abs(endY - startY) / 2;

						this.drawingEllipse(
							centerEllipseX, 
							centerEllipseY, 
							radiusX, 
							radiusY, 
							rubberFootprintColor
						);
						break;
					case shapeTypes.circle:
						const radius =
               		Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / 2;
						const centerCircleX = (startX + endX) / 2;
						const centerCircleY = (startY + endY) / 2;

						this.drawingCircle(
							centerCircleX, 
							centerCircleY, 
							radius, 
							rubberFootprintColor
						);
						break;
					default:
						throw new Error("Такої фігури не існує.");
				}
			}
      };

      const onMouseUp = (event) => {
         if (!isDrawing) return;

         isDrawing = false;

         endX = event.clientX - rect.left;
         endY = event.clientY - rect.top;

         if (startX !== null && startY !== null) {
            switch (currentShapeType) {
					case shapeTypes.dot:
						this.drawingDot(startX, startY, color);

						shapes.push({ type: shapeTypes.dot, startX, startY, color });

						console.log("Точка малюється.", { startX, startY, color });
						console.log("Список фігур:", shapes);
						break;
					case shapeTypes.line:
						this.drawingLine(startX, startY, endX, endY, color);

						shapes.push({
							type: shapeTypes.line,
							startX,
							startY,
							endX,
							endY,
							color,
						});

						console.log("Лінія намальована.", { startX, startY, endX, endY, color });
						console.log("Список фігур:", shapes);
						break;
					case shapeTypes.rectangle:
						const width = endX - startX;
						const height = endY - startY;

						this.drawingRectangle(startX, startY, width, height, color);

						shapes.push({
							type: shapeTypes.rectangle,
							startX,
							startY,
							width,
							height,
							color,
						});

						console.log("Прямокутник намальовано.", {
							startX,
							startY,
							width,
							height,
							color,
						});
						console.log("Список фігур:", shapes);
						break;
					case shapeTypes.ellipse:
						const centerEllipseX = (startX + endX) / 2;
						const centerEllipseY = (startY + endY) / 2;
						const radiusX = Math.abs(endX - startX) / 2;
						const radiusY = Math.abs(endY - startY) / 2;

						this.drawingEllipse(centerEllipseX, centerEllipseY, radiusX, radiusY, color);

						shapes.push({
							type: shapeTypes.ellipse,
							centerEllipseX,
							centerEllipseY,
							radiusX,
							radiusY,
							color,
						});

						console.log("Еліпс намальовано.", {
							centerEllipseX,
							centerEllipseY,
							radiusX,
							radiusY,
							color,
						});
						console.log("Список фігур:", shapes);
						break;
					case shapeTypes.circle:
						const radius =
               		Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / 2;

						const centerCircleX = (startX + endX) / 2;
						const centerCircleY = (startY + endY) / 2;

						this.drawingCircle(centerCircleX, centerCircleY, radius, color);

						shapes.push({
							type: shapeTypes.circle,
							centerCircleX,
							centerCircleY,
							radius,
							color,
						});

						console.log("Круг намальовано.", { centerCircleX, centerCircleY, radius, color });
						console.log("Список фігур:", shapes);
						break;
					default:
						throw new Error("Такої фігури не існує.");
				}
         }

         startX = null;
         startY = null;
         endX = null;
         endY = null;

         canvas.removeEventListener("mousemove", onMouseMove);
         canvas.removeEventListener("mouseup", onMouseUp);
      };

      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
	}
/*
   drawDot(event) {
      const canvas = this.#canvas;
      const shapes = this.#shapes;
		const color = this.#color;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      this.drawingDot(x, y, color);

      shapes.push({ type: "dot", x, y, color });

      console.log("Точка малюється.", { x, y, color });
      console.log("Список фігур:", shapes);
   }

   drawLine() {
      const canvas = this.#canvas;
      const ctx = this.#context;
      const shapes = this.#shapes;

      let isDrawing = false;
      let startX = null;
      let startY = null;
      let endX = null;
      let endY = null;

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

         ctx.clearRect(0, 0, canvas.width, canvas.height);
         this.redrawShapes(ctx);
         if (startX !== null && startY !== null) {
            this.drawingLine(startX, startY, endX, endY, "red");
         }
      };

      const onMouseUp = (event) => {
         if (!isDrawing) return;

         isDrawing = false;

         const rect = canvas.getBoundingClientRect();
         endX = event.clientX - rect.left;
         endY = event.clientY - rect.top;

         if (startX !== null && startY !== null) {
            this.drawingLine(startX, startY, endX, endY, "black");

            shapes.push({
               type: "line",
               startX,
               startY,
               endX,
               endY,
            });

            console.log("Лінія намальована.", { startX, startY, endX, endY });
            console.log("Список фігур:", shapes);
         }

         startX = null;
         startY = null;
         endX = null;
         endY = null;

         canvas.removeEventListener("mousedown", onMouseDown);
         canvas.removeEventListener("mousemove", onMouseMove);
         canvas.removeEventListener("mouseup", onMouseUp);
      };

      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
   }

   drawRectangle() {
      const canvas = this.#canvas;
      const ctx = this.#context;
      const shapes = this.#shapes;

      let isDrawing = false;
      let startX = null;
      let startY = null;
      let endX = null;
      let endY = null;

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

         ctx.clearRect(0, 0, canvas.width, canvas.height);
         this.redrawShapes(ctx);

         if (startX !== null && startY !== null) {
            const width = endX - startX;
            const height = endY - startY;

            this.drawingRectangle(startX, startY, width, height, "red");
         }
      };

      const onMouseUp = (event) => {
         if (!isDrawing) return;

         isDrawing = false;

         const rect = canvas.getBoundingClientRect();
         endX = event.clientX - rect.left;
         endY = event.clientY - rect.top;

         if (startX !== null && startY !== null) {
            const width = endX - startX;
            const height = endY - startY;

            this.drawingRectangle(startX, startY, width, height, "black");

            shapes.push({
               type: "rectangle",
               startX,
               startY,
               width,
               height,
            });

            console.log("Прямокутник намальовано.", {
               startX,
               startY,
               width,
               height,
            });
            console.log("Список фігур:", shapes);
         }

         startX = null;
         startY = null;
         endX = null;
         endY = null;

         canvas.removeEventListener("mousedown", onMouseDown);
         canvas.removeEventListener("mousemove", onMouseMove);
         canvas.removeEventListener("mouseup", onMouseUp);
      };

      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
   }

   drawEllipse() {
      const canvas = this.#canvas;
      const ctx = this.#context;
      const shapes = this.#shapes;

      let isDrawing = false;
      let startX = null;
      let startY = null;
      let endX = null;
      let endY = null;

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

         ctx.clearRect(0, 0, canvas.width, canvas.height);
         this.redrawShapes(ctx);

         if (startX !== null && startY !== null) {
            const centerX = (startX + endX) / 2;
            const centerY = (startY + endY) / 2;
            const radiusX = Math.abs(endX - startX) / 2;
            const radiusY = Math.abs(endY - startY) / 2;

            this.drawingEllipse(centerX, centerY, radiusX, radiusY, "red");
         }
      };

      const onMouseUp = (event) => {
         if (!isDrawing) return;

         isDrawing = false;

         const rect = canvas.getBoundingClientRect();
         endX = event.clientX - rect.left;
         endY = event.clientY - rect.top;

         if (startX !== null && startY !== null) {
            const centerX = (startX + endX) / 2;
            const centerY = (startY + endY) / 2;
            const radiusX = Math.abs(endX - startX) / 2;
            const radiusY = Math.abs(endY - startY) / 2;

            this.drawingEllipse(centerX, centerY, radiusX, radiusY, "black");

            shapes.push({
               type: "ellipse",
               centerX,
               centerY,
               radiusX,
               radiusY,
            });

            console.log("Еліпс намальовано.", {
               centerX,
               centerY,
               radiusX,
               radiusY,
            });
            console.log("Список фігур:", shapes);
         }

         startX = null;
         startY = null;
         endX = null;
         endY = null;

         canvas.removeEventListener("mousemove", onMouseMove);
         canvas.removeEventListener("mouseup", onMouseUp);
      };

      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
   }

   drawCircle() {
      const canvas = this.#canvas;
      const ctx = this.#context;
      const shapes = this.#shapes;

      let isDrawing = false;
      let startX = null;
      let startY = null;
      let endX = null;
      let endY = null;

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

         ctx.clearRect(0, 0, canvas.width, canvas.height);
         this.redrawShapes(ctx);

         if (startX !== null && startY !== null) {
            const radius =
               Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / 2;

            const centerX = (startX + endX) / 2;
            const centerY = (startY + endY) / 2;

            this.drawingCircle(centerX, centerY, radius, "red");
         }
      };

      const onMouseUp = (event) => {
         if (!isDrawing) return;

         isDrawing = false;

         const rect = canvas.getBoundingClientRect();
         endX = event.clientX - rect.left;
         endY = event.clientY - rect.top;

         if (startX !== null && startY !== null) {
            const radius =
               Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / 2;

            const centerX = (startX + endX) / 2;
            const centerY = (startY + endY) / 2;

            this.drawingCircle(centerX, centerY, radius, "black");

            shapes.push({
               type: "circle",
               centerX,
               centerY,
               radius,
            });

            console.log("Круг намальовано.", { centerX, centerY, radius });
            console.log("Список фігур:", shapes);
         }

         startX = null;
         startY = null;
         endX = null;
         endY = null;

         canvas.removeEventListener("mousemove", onMouseMove);
         canvas.removeEventListener("mouseup", onMouseUp);
      };

      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
   }
*/
   drawingDot(x, y, color) {
      const ctx = this.#context;

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
   }

   drawingLine(startX, startY, endX, endY, color) {
      const ctx = this.#context;

      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
   }

   drawingRectangle(startX, startY, width, height, color) {
      const ctx = this.#context;

      ctx.beginPath();
      ctx.rect(startX, startY, width, height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
   }

   drawingEllipse(centerX, centerY, radiusX, radiusY, color) {
      const ctx = this.#context;

      ctx.beginPath();
      ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.stroke();
   }

   drawingCircle(centerX, centerY, radius, color) {
      const ctx = this.#context;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
   }

   redrawShapes(ctx) {
      const shapes = this.#shapes;
		const shapeTypes = this.#shapeTypes;

      shapes.forEach((shape) => {
         const shapeType = shape.type;

         switch (shapeType) {
            case shapeTypes.dot:
               this.drawingDot(shape.startX, shape.startY, shape.color );
               break;
            case shapeTypes.line:
               this.drawingLine(
                  shape.startX,
                  shape.startY,
                  shape.endX,
                  shape.endY,
                  shape.color,
               );
               break;
            case shapeTypes.rectangle:
               this.drawingRectangle(
                  shape.startX,
                  shape.startY,
                  shape.width,
                  shape.height,
                  shape.color,
               );
               break;
            case shapeTypes.ellipse:
               this.drawingEllipse(
                  shape.centerEllipseX,
                  shape.centerEllipseY,
                  shape.radiusX,
                  shape.radiusY,
                  shape.color,
               );
               break;
            case shapeTypes.circle:
               this.drawingCircle(
                  shape.centerCircleX,
                  shape.centerCircleY,
                  shape.radius,
                  shape.color,
               );
               break;
            default:
               throw new Error("Такої фігури не існує.");
         }
      });
   }

   // =============================================================

   enableFill() {
      console.log("Інструмент заливання виконується.");
   }

   enableEraser() {
      console.log("Інструмент ластик виконується.");
   }

   enableMoveObject() {
      console.log("Переміщення об'єкту виконується.");
   }

   enableZoomIn() {
      console.log("Інструмент збільшення виконується.");
   }

   enableZoomOut() {
      console.log("Інструмент зменшення виконується.");
   }

   enableUndo() {
      console.log("Скасування останньої дії виконується.");
   }

   enableColorChange() {
      console.log("Зміна кольору виконується.");
   }

   enableThicknessChange() {
      console.log("Зміна товщини виконується.");
   }

   enableClear() {
      console.log("Очищення виконується.");
   }

   toggleButton(buttonName) {
      const canvas = document.getElementById("drawingCanvas");

      const clearEventListeners = () => {
         canvas.removeEventListener("mousedown", this.#activeDrawHandler);
         canvas.removeEventListener("mousemove", this.#activeDrawHandler);
         canvas.removeEventListener("mouseup", this.#activeDrawHandler);
         canvas.removeEventListener("click", this.#activeDrawHandler);
      };

      if (this.#activeButton === buttonName) {
         canvas.removeEventListener("click", this.#activeDrawHandler);
         console.log(`${this.#activeButton} деактивовано.`);

         this.#activeButton = null;
         this.#activeDrawHandler = null;

         return;
      }

      // Якщо натискається інша кнопка, спочатку деактивуємо попередню
      if (this.#activeDrawHandler) {
         clearEventListeners();
         console.log(`${this.#activeButton} деактивовано.`);
      }

      // Активуємо нову кнопку
      this.#activeButton = buttonName;
      this.#activeDrawHandler = this.#actions[buttonName];

      canvas.addEventListener("click", this.#activeDrawHandler);

      console.log(`${buttonName} активовано.`);
   }

   createToolWinWithActions(nx, ny, buttonSize, images, tooltips) {
      super.createToolWin(nx, ny, buttonSize, images, tooltips);

      const buttons = document.querySelectorAll("#button-container button");

      buttons.forEach((button, index) => {
         const tooltip = tooltips[index];
         button.addEventListener("click", () => this.toggleButton(tooltip));
      });
   }
}
