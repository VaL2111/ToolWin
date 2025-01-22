export class ToolWin {
  constructor() {
    this.toolWin = null;
  }

  createToolWin(nx, ny, buttonSize, images = [], tooltips = []) {
    if (this.toolWin) return;

    this.toolWin = document.createElement("div");

    const toolwin = this.toolWin;
    toolwin.id = "toolwin";

    const toolWinTitle = document.createElement("div");
    toolWinTitle.id = "toolwin-title";
    toolWinTitle.textContent = "ToolWin";

    const closeButton = document.createElement("div");
    closeButton.innerHTML = `<img src="/svg/red-cross.svg" alt="Close">`;
    closeButton.id = "close-toolwin-btn";

    closeButton.addEventListener("click", () => {
      this.closeToolWin(toolwin);
    });

    const buttonContainer = document.createElement("div");
    buttonContainer.id = "button-container";
    buttonContainer.style.gridTemplateColumns = `repeat(${nx}, ${buttonSize}px)`;
    buttonContainer.style.gridTemplateRows = `repeat(${ny}, ${buttonSize}px)`;

    toolwin.appendChild(toolWinTitle);
    toolwin.appendChild(closeButton);
    toolwin.appendChild(buttonContainer);

    document.body.appendChild(toolwin);

    this.createButtons(nx, ny, buttonSize, images, buttonContainer);

    const buttons = buttonContainer.querySelectorAll("button");
    this.showToolTips(buttons, tooltips);

    this.showActiveButton();
    this.moveToolWin(toolWinTitle);
    this.createDefaultToolWinSize(nx, ny, buttonSize);
  }

  closeToolWin() {
    this.toolWin.remove();
    this.toolWin = null;
  }

  createButtons(nx, ny, buttonSize, images, buttonContainer) {
    const totalButtons = nx * ny;

    for (let i = 0; i < totalButtons; i++) {
      const button = document.createElement("button");
      button.style.width = `${buttonSize}px`;
      button.style.height = `${buttonSize}px`;

      if (images[i]) {
        button.style.backgroundImage = `url(${images[i]})`;
      }

      buttonContainer.appendChild(button);
    }
  }

  showToolTips(buttons, tooltips) {
    const tooltip = document.createElement("div");
    tooltip.id = "tooltip";
    document.body.appendChild(tooltip);

    buttons.forEach((button, index) => {
      button.addEventListener("mouseover", (event) => {
        tooltip.style.display = "block";
        tooltip.textContent = tooltips[index];
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
      });

      button.addEventListener("mousemove", (event) => {
        tooltip.style.left = `${event.pageX + 10}px`;
        tooltip.style.top = `${event.pageY + 10}px`;
      });

      button.addEventListener("mouseleave", () => {
        tooltip.style.display = "none";
      });
    });
  }

  showActiveButton() {
    const buttons = document.querySelectorAll("#button-container button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        if (button.classList.contains("active")) {
          button.classList.remove("active");
        } else {
          buttons.forEach((btn) => btn.classList.remove("active"));

          button.classList.add("active");
        }
      });
    });
  }

  moveToolWin(title) {
    const toolWin = this.toolWin;
    const cursorOffset = { x: 0, y: 0 };
    let isMoving = false;

    title.addEventListener("mousedown", (event) => {
      isMoving = true;
      const rect = toolWin.getBoundingClientRect();

      cursorOffset.x = event.clientX - rect.left;
      cursorOffset.y = event.clientY - rect.top;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    const onMouseMove = (event) => {
      if (!isMoving) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const toolWinWidth = toolWin.offsetWidth;
      const toolWinHeight = toolWin.offsetHeight;

      let left = event.clientX - cursorOffset.x;
      let top = event.clientY - cursorOffset.y;

      left = Math.max(0, Math.min(left, viewportWidth - toolWinWidth));
      top = Math.max(0, Math.min(top, viewportHeight - toolWinHeight));

      toolWin.style.left = `${left}px`;
      toolWin.style.top = `${top}px`;
    };

    const onMouseUp = () => {
      isMoving = false;

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }

  createDefaultToolWinSize(nx, ny, buttonSize) {
    const toolwin = this.toolWin;

    const containerWidth = nx * buttonSize + (nx - 1) * 10;
    const containerHeight = ny * buttonSize + (ny - 1) * 10;
    const toolWinTitleHeight = 50;
    const buttonContainerPadding = 10;
    const toolWinMinWidth = 100;

    toolwin.style.width = `${Math.max(
      toolWinMinWidth,
      containerWidth + buttonContainerPadding
    )}px`;
    toolwin.style.height = `${
      containerHeight + toolWinTitleHeight + buttonContainerPadding
    }px`;
  }
}
