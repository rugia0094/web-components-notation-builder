import { ELEMENT_TYPE } from "../constants";
import { createNewId } from "./id";

/**
 * example Block = {
 *  id: number,
 *  type: "BLOCK",
 *  points: {x1, y1, x2, y2} // TopLeft + BottomRight.
 *  text: string,
 * };
 */
export const drawBlock = (roughCanvas, canvasContext, block) => {
  const { points, text, blockId } = block;

  const width = points.x2 - points.x1;
  const height = points.y2 - points.y1;

  roughCanvas.rectangle(points.x1, points.y1, width, height, {
    fill: "white",
    fillStyle: "solid",
    roughness: 0.1,
    stroke: "black",
  });

  const textX = points.x1 + width / 2;
  const textY = points.y1 + height / 2;

  let idX = points.x1 + 5;
  let idY = points.y1 + 5;

  if (points.x2 < points.x1) {
    idX = points.x2 + 5;
  }

  if (points.y2 < points.y1) {
    idY = points.y2 + 5;
  }

  if (text !== "EMPTY") {
    canvasContext.font = "20px Arial";
    canvasContext.textAlign = "center";
    canvasContext.textBaseline = "middle";
    canvasContext.fillStyle = "black";
    canvasContext.fillText(text, textX, textY);
  }

  canvasContext.font = "14px Arial";
  canvasContext.textAlign = "left";
  canvasContext.textBaseline = "top";
  canvasContext.fillText(`${blockId}`, idX, idY);
};

export const createBlock = (id, x1, y1, x2, y2, text, blockId) => ({
  id: id ? id : createNewId(),
  type: ELEMENT_TYPE.BLOCK,
  blockId: blockId ? blockId : "0",
  text: text ? text : "NewComponent",
  points: {
    x1,
    y1,
    x2,
    y2,
  },
});
