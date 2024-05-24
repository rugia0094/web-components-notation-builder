import { distance } from "./math";
import { ELEMENT_TYPE, TOOL } from "../constants";

const isWithinBlock = (x, y, block) => {
  const minX = Math.min(block.points.x1, block.points.x2);
  const maxX = Math.max(block.points.x1, block.points.x2);
  const minY = Math.min(block.points.y1, block.points.y2);
  const maxY = Math.max(block.points.y1, block.points.y2);

  return x >= minX - 20 && x <= maxX + 20 && y >= minY - 20 && y <= maxY + 20;
};

const isWithinArrow = (x, y, arrow) => {
  const c = { x: x, y: y };

  for (let i = 0; i < arrow.points.length - 1; i++) {
    const a = { x: arrow.points[i].x, y: arrow.points[i].y };
    const b = { x: arrow.points[i + 1].x, y: arrow.points[i + 1].y };

    const offset = distance(a, b) - (distance(a, c) + distance(b, c));

    if (Math.abs(offset) < 2) {
      return true;
    }
  }

  return false;
};

const isWithinCircle = (x, y, element) =>
  Math.abs(x - element.center.x) < 60 && Math.abs(y - element.center.y) < 60;

export const isWithinElement = (x, y, element) => {
  if (element.type === ELEMENT_TYPE.BLOCK) {
    return isWithinBlock(x, y, element);
  }

  if (element.type === ELEMENT_TYPE.ARROW) {
    return isWithinArrow(x, y, element);
  }

  if (element.type === ELEMENT_TYPE.CIRCLE) {
    return isWithinCircle(x, y, element);
  }
};

export const mouseIsNearPoint = (x, y, pointX, pointY) =>
  Math.abs(x - pointX) < 20 && Math.abs(y - pointY) < 20;

export const getElementAtMousePosition = (x, y, elements) =>
  [...elements].reverse().find((element) => isWithinElement(x, y, element));

export const getMouseCoordinates = (event, panOffset, scale, scaleOffset) => ({
  clientX: (event.clientX - panOffset.x * scale + scaleOffset.x) / scale,
  clientY: (event.clientY - panOffset.y * scale + scaleOffset.y) / scale,
});

export const updateCursorStyle = (
  event,
  clientX,
  clientY,
  currentTool,
  elements
) => {
  if (currentTool === TOOL.SELECTION || currentTool === TOOL.DELETE) {
    if (getElementAtMousePosition(clientX, clientY, elements)) {
      event.target.style.cursor = "move";
      return;
    }
  }

  if (currentTool === TOOL.RESIZE) {
    const element = getElementAtMousePosition(clientX, clientY, elements);

    if (element) {
      if (element.type === ELEMENT_TYPE.BLOCK) {
        if (
          mouseIsNearPoint(
            clientX,
            clientY,
            element.points.x2,
            element.points.y2
          )
        ) {
          event.target.style.cursor = "move";
          return;
        }
      }

      if (element.type === ELEMENT_TYPE.ARROW) {
        if (
          mouseIsNearPoint(
            clientX,
            clientY,
            element.points[element.points.length - 1].x,
            element.points[element.points.length - 1].y
          )
        ) {
          event.target.style.cursor = "move";
          return;
        }
      }
    }
  }

  event.target.style.cursor = "default";
};
