import { createNewId } from "./id";
import { ELEMENT_TYPE, CIRCLE_SIZE } from "../constants";

/**
 * example Circle = {
 *  id: number,
 *  type: "CIRCLE",
 *  center: {x, y}
 * };
 */
export const drawCircle = (roughCanvas, circle) => {
  const rough = roughCanvas;
  const { center } = circle;

  rough.circle(center.x, center.y, CIRCLE_SIZE, {
    roughness: 0.1,
    stroke: "black",
  });
};

export const createCircle = (id, center) => ({
  id: id ? id : createNewId(),
  type: ELEMENT_TYPE.CIRCLE,
  center: center,
});
