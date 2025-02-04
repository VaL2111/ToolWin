import { ToolWin } from "./ToolWin.js";

export class CustomToolWin extends ToolWin {
  #actions;
  #shapes;
  #activeButtonName;
  #canvas;
  #context;
  #color;
  #shapeTypes;
  #zoomLevel;
  #activeButton;
  #onMouseDown;
  #onMouseMove;
  #onMouseUp;

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
      Очищення: this.enableClear.bind(this),
    };

    this.#shapes = [];
    this.#activeButtonName = null;
    this.#color = "black";
    this.#shapeTypes = {
      dot: "Малювання точки",
      line: "Малювання лінії",
      rectangle: "Малювання прямокутника",
      ellipse: "Малювання еліпса",
      circle: "Малювання круга",
    };

    this.#zoomLevel = 1;
    this.#activeButton = null;

    this.#canvas = document.getElementById("drawingCanvas");
    this.#context = this.#canvas.getContext("2d");
  }

  drawShapes() {
    const canvas = this.#canvas;
    const ctx = this.#context;
    const shapes = this.#shapes;
    const color = this.#color;
    const shapeTypes = this.#shapeTypes;
    let currentShapeType = this.#activeButtonName;

    let isDrawing = false;
    let startX = null;
    let startY = null;
    let endX = null;
    let endY = null;

    const rect = canvas.getBoundingClientRect();

    const calculateCoordinates = (event) => {
      const x = (event.clientX - rect.left) / this.#zoomLevel;
      const y = (event.clientY - rect.top) / this.#zoomLevel;

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

    this.#onMouseDown = (event) => {
      currentShapeType = this.#activeButtonName;
      isDrawing = true;

      const { x, y } = calculateCoordinates(event);
      startX = x;
      startY = y;
    };

    this.#onMouseMove = (event) => {
      if (!isDrawing) return;
      const { x, y } = calculateCoordinates(event);
      endX = x;
      endY = y;
      drawRubberFootprint();
    };

    this.#onMouseUp = (event) => {
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
    };

    canvas.addEventListener("mousedown", this.#onMouseDown);
    canvas.addEventListener("mousemove", this.#onMouseMove);
    canvas.addEventListener("mouseup", this.#onMouseUp);
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
    const maxZoom = 2.0736;
    this.#zoomLevel = Math.min(maxZoom, this.#zoomLevel * 1.2);
    this.rezoom();
  }

  enableZoomOut() {
    const minZoom = 0.482253086;
    this.#zoomLevel = Math.max(minZoom, this.#zoomLevel / 1.2);
    this.rezoom();
  }

  rezoom() {
    const ctx = this.#context;
    const canvas = this.#canvas;
    const zoomLevel = this.#zoomLevel;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(zoomLevel, 0, 0, zoomLevel, 0, 0);
    this.redrawShapes();

    this.resetActiveState();
  }

  enableUndo() {
    const shapes = this.#shapes;
    const canvas = this.#canvas;

    if (shapes.length === 0) {
      this.resetActiveState();
      return;
    }

    const ctx = this.#context;

    shapes.pop();

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.redrawShapes();

    this.resetActiveState();
  }

  resetActiveState() {
    const activeButton = this.#activeButton;

    this.#activeButtonName = null;

    setTimeout(() => {
      activeButton.classList.remove("active");
    }, 250);
  }

  enableColorChange() {
    console.log("Зміна кольору виконується.");
  }

  enableThicknessChange() {
    console.log("Зміна товщини виконується.");
  }

  enableClear() {
    if (this.#shapes.length === 0) {
      this.resetActiveState();
      return;
    }

    const confirmation = confirm("Ви впевнені, що хочете очистити всі фігури?");

    if (confirmation) {
      const ctx = this.#context;

      this.#shapes = [];
      ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

      this.resetActiveState();
    }
  }

  clearAllEventListeners() {
    const canvas = this.#canvas;

    canvas.removeEventListener("mousedown", this.#onMouseDown);
    canvas.removeEventListener("mousemove", this.#onMouseMove);
    canvas.removeEventListener("mouseup", this.#onMouseUp);
  }

  toggleButton(buttonName) {
    if (this.#activeButtonName === buttonName) {
      this.#activeButtonName = null;
      this.clearAllEventListeners();
      return;
    }

    this.clearAllEventListeners();
    this.#activeButtonName = buttonName;
    this.#actions[buttonName]();
  }

  createToolWinWithActions(nx, ny, buttonSize, images, tooltips) {
    super.createToolWin(nx, ny, buttonSize, images, tooltips);

    const buttons = document.querySelectorAll("#button-container button");

    buttons.forEach((button, index) => {
      const tooltip = tooltips[index];
      button.addEventListener("click", () => {
        this.#activeButton = button;
        this.toggleButton(tooltip);
      });
    });
  }
}
