import { ToolWin } from "./ToolWin.js";

export class CustomToolWin extends ToolWin {
  #actions;
  #shapes;
  #activeButton;
  #activeHandler;
  #canvas;
  #context;
  #color;
  #shapeTypes;

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
    this.#activeHandler = null;
    this.#color = "black";
    this.#shapeTypes = {
      dot: "Малювання точки",
      line: "Малювання лінії",
      rectangle: "Малювання прямокутника",
      ellipse: "Малювання еліпса",
      circle: "Малювання круга",
    };

    this.#canvas = document.getElementById("drawingCanvas");
    this.#context = this.#canvas.getContext("2d");
  }

  drawShapes() {
    const canvas = this.#canvas;
    const ctx = this.#context;
    const shapes = this.#shapes;
    const color = this.#color;
    const shapeTypes = this.#shapeTypes;
    let currentShapeType = this.#activeButton;

    let isDrawing = false;
    let startX = null;
    let startY = null;
    let endX = null;
    let endY = null;

    const rect = canvas.getBoundingClientRect();

    const calculateCoordinates = (event) => {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      return { x, y };
    };

    const drawRubberFootprint = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.redrawShapes();
      const rubberFootprintColor = "red";

      const shapeDrawFunctions = {
        [shapeTypes.line]: () =>
          this.drawLine(startX, startY, endX, endY, rubberFootprintColor),
        [shapeTypes.rectangle]: () => {
          const width = endX - startX;
          const height = endY - startY;
          this.drawRectangle(
            startX,
            startY,
            width,
            height,
            rubberFootprintColor
          );
        },
        [shapeTypes.ellipse]: () => {
          const centerX = (startX + endX) / 2;
          const centerY = (startY + endY) / 2;
          const radiusX = Math.abs(endX - startX) / 2;
          const radiusY = Math.abs(endY - startY) / 2;
          this.drawEllipse(
            centerX,
            centerY,
            radiusX,
            radiusY,
            rubberFootprintColor
          );
        },
        [shapeTypes.circle]: () => {
          const radius =
            Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / 2;
          const centerX = (startX + endX) / 2;
          const centerY = (startY + endY) / 2;
          this.drawCircle(centerX, centerY, radius, rubberFootprintColor);
        },
      };

      if (shapeDrawFunctions[currentShapeType]) {
        shapeDrawFunctions[currentShapeType]();
      }
    };

    const addShapeToList = () => {
      const shapeData = {
        [shapeTypes.dot]: () => ({
          type: shapeTypes.dot,
          startX,
          startY,
          color,
        }),
        [shapeTypes.line]: () => ({
          type: shapeTypes.line,
          startX,
          startY,
          endX,
          endY,
          color,
        }),
        [shapeTypes.rectangle]: () => {
          const width = endX - startX;
          const height = endY - startY;
          return {
            type: shapeTypes.rectangle,
            startX,
            startY,
            width,
            height,
            color,
          };
        },
        [shapeTypes.ellipse]: () => {
          const centerX = (startX + endX) / 2;
          const centerY = (startY + endY) / 2;
          const radiusX = Math.abs(endX - startX) / 2;
          const radiusY = Math.abs(endY - startY) / 2;
          return {
            type: shapeTypes.ellipse,
            centerX,
            centerY,
            radiusX,
            radiusY,
            color,
          };
        },
        [shapeTypes.circle]: () => {
          const radius =
            Math.max(Math.abs(endX - startX), Math.abs(endY - startY)) / 2;
          const centerX = (startX + endX) / 2;
          const centerY = (startY + endY) / 2;
          return { type: shapeTypes.circle, centerX, centerY, radius, color };
        },
      };

      const shape = shapeData[currentShapeType]?.();

      if (shape) {
        shapes.push(shape);
        console.log(`${shape.type} намальовано.`, shape);
        console.log("Список фігур:", shapes);
      }
    };

    const onMouseDown = (event) => {
      currentShapeType = this.#activeButton;

      const { x, y } = calculateCoordinates(event);
      startX = x;
      startY = y;
      isDrawing = true;

      canvas.addEventListener("mousemove", onMouseMove);
      canvas.addEventListener("mouseup", onMouseUp);
    };

    const onMouseMove = (event) => {
      if (!isDrawing) return;
      const { x, y } = calculateCoordinates(event);
      endX = x;
      endY = y;
      drawRubberFootprint();
    };

    const onMouseUp = (event) => {
      if (!isDrawing) return;
      isDrawing = false;

      const { x, y } = calculateCoordinates(event);
      endX = x;
      endY = y;

      addShapeToList();
      this.redrawShapes();

      startX = null;
      startY = null;
      endX = null;
      endY = null;

      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
    };

		canvas.addEventListener("mousedown", onMouseDown);
  }

  drawDot(x, y, color) {
    const ctx = this.#context;

    ctx.beginPath();
    ctx.arc(x, y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  drawLine(startX, startY, endX, endY, color) {
    const ctx = this.#context;

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawRectangle(startX, startY, width, height, color) {
    const ctx = this.#context;

    ctx.beginPath();
    ctx.rect(startX, startY, width, height);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawEllipse(centerX, centerY, radiusX, radiusY, color) {
    const ctx = this.#context;

    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  drawCircle(centerX, centerY, radius, color) {
    const ctx = this.#context;

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  redrawShapes() {
    const shapes = this.#shapes;
    const shapeTypes = this.#shapeTypes;

    const drawMethods = {
      [shapeTypes.dot]: (shape) =>
        this.drawDot(shape.startX, shape.startY, shape.color),
      [shapeTypes.line]: (shape) =>
        this.drawLine(
          shape.startX,
          shape.startY,
          shape.endX,
          shape.endY,
          shape.color
        ),
      [shapeTypes.rectangle]: (shape) =>
        this.drawRectangle(
          shape.startX,
          shape.startY,
          shape.width,
          shape.height,
          shape.color
        ),
      [shapeTypes.ellipse]: (shape) =>
        this.drawEllipse(
          shape.centerX,
          shape.centerY,
          shape.radiusX,
          shape.radiusY,
          shape.color
        ),
      [shapeTypes.circle]: (shape) =>
        this.drawCircle(
          shape.centerX,
          shape.centerY,
          shape.radius,
          shape.color
        ),
    };

    shapes.forEach((shape) => {
      const drawMethod = drawMethods[shape.type];
      if (drawMethod) {
        drawMethod(shape);
      } else {
        throw new Error("Такої фігури не існує.");
      }
    });
  }

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
    const canvas = this.#canvas;

    if (this.#activeButton === buttonName) {
      canvas.removeEventListener("click", this.#activeHandler);
      console.log(`${this.#activeButton} деактивовано.`);

      this.#activeButton = null;
      this.#activeHandler = null;

      return;
    }

    if (this.#activeHandler) {
      canvas.removeEventListener("click", this.#activeHandler);
      console.log(`${this.#activeButton} деактивовано.`);
    }

    this.#activeButton = buttonName;
    this.#activeHandler = this.#actions[buttonName];

    canvas.addEventListener("click", this.#activeHandler);
		this.#activeHandler();

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
