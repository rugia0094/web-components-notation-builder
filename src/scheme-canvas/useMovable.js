import { ref } from "vue";
import { ELEMENT_TYPE } from "./constants";
import { createBlock } from "./utils/block";
import { createArrow } from "./utils/arrow";
import { createCircle } from "./utils/circle";

export const useMovable = (elements, clientX, clientY) => {
  const movableElement = ref(null);
  const movingOffset = ref({ x: 0, y: 0 });

  const startMoving = (element) => {
    if (element.type === ELEMENT_TYPE.BLOCK) {
      movingOffset.value.x = clientX.value - element.points.x1;
      movingOffset.value.y = clientY.value - element.points.y1;
    }

    if (element.type === ELEMENT_TYPE.ARROW) {
      movingOffset.value.x = clientX.value - element.points[0].x;
      movingOffset.value.y = clientY.value - element.points[0].y;
    }

    if (element.type === ELEMENT_TYPE.CIRCLE) {
      movingOffset.value.x = clientX.value - element.center.x;
      movingOffset.value.y = clientY.value - element.center.y;
    }

    movableElement.value = element;
  };

  const moveBlock = (movableElementCopy) => {
    const blockCopy = { ...movableElementCopy };

    elements.value = elements.value.filter(
      (element) => element.id !== blockCopy.id
    );

    if (blockCopy.blockId.split(" ").length > 1) {
      elements.value.unshift(
        createBlock(
          blockCopy.id,
          clientX.value - movingOffset.value.x,
          clientY.value - movingOffset.value.y,
          clientX.value -
            movingOffset.value.x +
            blockCopy.points.x2 -
            blockCopy.points.x1,
          clientY.value -
            movingOffset.value.y +
            blockCopy.points.y2 -
            blockCopy.points.y1,
          blockCopy.text,
          blockCopy.blockId
        )
      );
    } else {
      elements.value.push(
        createBlock(
          blockCopy.id,
          clientX.value - movingOffset.value.x,
          clientY.value - movingOffset.value.y,
          clientX.value -
            movingOffset.value.x +
            blockCopy.points.x2 -
            blockCopy.points.x1,
          clientY.value -
            movingOffset.value.y +
            blockCopy.points.y2 -
            blockCopy.points.y1,
          blockCopy.text,
          blockCopy.blockId
        )
      );
    }

    elements.value.push();
  };

  const moveArrow = (movableElementCopy) => {
    elements.value = elements.value.filter(
      (element) => element.id !== movableElementCopy.id
    );

    elements.value.push(
      createArrow(
        movableElementCopy.id,
        movableElementCopy.points.map((point) => {
          return {
            x:
              point.x +
              clientX.value -
              movableElementCopy.points[0].x -
              movingOffset.value.x,
            y:
              point.y +
              clientY.value -
              movableElementCopy.points[0].y -
              movingOffset.value.y,
          };
        }),
        movableElementCopy.text
      )
    );
  };

  const moveCircle = (movableElementCopy) => {
    elements.value = elements.value.filter(
      (element) => element.id !== movableElementCopy.id
    );

    elements.value.push(
      createCircle(movableElementCopy.id, {
        x: clientX.value - movingOffset.value.x,
        y: clientY.value - movingOffset.value.y,
      })
    );
  };

  return {
    movableElement,
    movingOffset,
    startMoving,
    moveBlock,
    moveArrow,
    moveCircle,
  };
};
