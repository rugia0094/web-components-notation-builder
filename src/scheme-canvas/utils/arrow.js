import { createNewId } from "./id";
import {
  ARROW_SIDE_SIZE,
  ARROW_DIRECTION_ANGLE,
  ELEMENT_TYPE,
} from "../constants";

const drawRotatableTriangle = (
  roughCanvas,
  centerX,
  centerY,
  triangleSideSize,
  arrowDirectionAngle
) => {
  const halfSideSize = triangleSideSize / 2;
  const x1 = centerX - halfSideSize;
  const y1 = centerY + halfSideSize;
  const x2 = centerX;
  const y2 = centerY - halfSideSize;
  const x3 = centerX + halfSideSize;
  const y3 = centerY + halfSideSize;

  const rotatePoint = (x, y, angle) => {
    const newX =
      Math.cos(angle) * (x - centerX) -
      Math.sin(angle) * (y - centerY) +
      centerX;
    const newY =
      Math.sin(angle) * (x - centerX) +
      Math.cos(angle) * (y - centerY) +
      centerY;
    return [newX, newY];
  };

  const [rotatedX1, rotatedY1] = rotatePoint(x1, y1, arrowDirectionAngle);
  const [rotatedX2, rotatedY2] = rotatePoint(x2, y2, arrowDirectionAngle);
  const [rotatedX3, rotatedY3] = rotatePoint(x3, y3, arrowDirectionAngle);

  roughCanvas.polygon(
    [
      [rotatedX1, rotatedY1],
      [rotatedX2, rotatedY2],
      [rotatedX3, rotatedY3],
    ],
    {
      stroke: "black",
      roughness: 0.1,
      fill: "black",
      fillStyle: "solid",
    }
  );
};

const drawArrowText = (canvasContext, text, points, arrowDirectionAngle) => {
  canvasContext.font = "20px Arial";
  canvasContext.textAlign = "center";
  canvasContext.textBaseline = "middle";
  canvasContext.fillStyle = "black";

  let textX = 0;
  let textY = 0;

  if (points.length === 2) {
    if (
      arrowDirectionAngle === ARROW_DIRECTION_ANGLE.LEFT ||
      arrowDirectionAngle === ARROW_DIRECTION_ANGLE.RIGHT
    ) {
      textX = (points[0].x + points[1].x) / 2;
      textY = points[0].y - 15;
    } else {
      textX = points[0].x + 5;
      textY = (points[0].y + points[1].y) / 2;

      canvasContext.textAlign = "left";
    }
  }

  if (points.length === 3) {
    if (
      arrowDirectionAngle === ARROW_DIRECTION_ANGLE.LEFT ||
      arrowDirectionAngle === ARROW_DIRECTION_ANGLE.RIGHT
    ) {
      textX = (points[1].x + points[2].x) / 2;
      textY = points[1].y - 15;
    } else {
      textX = (points[0].x + points[1].x) / 2;
      textY = points[1].y - 15;
    }

    // left or right = second line
    // top or bottom = first line
  }

  canvasContext.fillText(text, textX, textY);
};

/**
 * example Arrow = {
 *  id: number,
 *  type: "ARROW",
 *  points: {x, y}[], // Must be at least 2. At least on coordinate must be the same between siblings.
 *  text: string,
 * };
 */
export const drawArrow = (roughCanvas, canvasContext, arrow) => {
  for (let i = 0; i < arrow.points.length - 1; i++) {
    roughCanvas.line(
      arrow.points[i].x,
      arrow.points[i].y,
      arrow.points[i + 1].x,
      arrow.points[i + 1].y,
      {
        roughness: 0.1,
      }
    );
  }

  let arrowDirectionAngle = ARROW_DIRECTION_ANGLE.DOWN;
  const prelastPoint = arrow.points[arrow.points.length - 2];
  const lastPoint = arrow.points[arrow.points.length - 1];

  if (lastPoint.y < prelastPoint.y) {
    arrowDirectionAngle = ARROW_DIRECTION_ANGLE.UP;
  }

  if (lastPoint.y > prelastPoint.y) {
    arrowDirectionAngle = ARROW_DIRECTION_ANGLE.DOWN;
  }

  if (lastPoint.x > prelastPoint.x) {
    arrowDirectionAngle = ARROW_DIRECTION_ANGLE.RIGHT;
  }

  if (lastPoint.x < prelastPoint.x) {
    arrowDirectionAngle = ARROW_DIRECTION_ANGLE.LEFT;
  }

  drawRotatableTriangle(
    roughCanvas,
    arrow.points[arrow.points.length - 1].x,
    arrow.points[arrow.points.length - 1].y,
    ARROW_SIDE_SIZE,
    arrowDirectionAngle
  );

  drawArrowText(canvasContext, arrow.text, arrow.points, arrowDirectionAngle);
};

export const createArrow = (id, points, text) => ({
  id: id ? id : createNewId(),
  type: ELEMENT_TYPE.ARROW,
  points: points,
  text: text ? text : "arrowText",
});
