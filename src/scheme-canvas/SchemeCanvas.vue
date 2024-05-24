<script setup>
import rough from "roughjs";
import { ref, onMounted } from "vue";
import { ACTION, ELEMENT_TYPE, TOOL, MIDDLE_BUTTON_ID } from "./constants";

import { useAction } from "./useAction";
import { useTool } from "./useTool";
import { useElements } from "./useElements";
import { useCanvasSizes } from "./useCanvasSizes";
import { usePanning } from "./usePanning";
import { useScaling } from "./useScaling";
import { usePressedKeys } from "./usePressedKeys";
import { useMovable } from "./useMovable";
import { useMousePosition } from "./useMousePosition";

import { drawBlock, createBlock as createComponentBlock } from "./utils/block";
import { drawCircle } from "./utils/circle";
import { drawArrow } from "./utils/arrow";
import {
  getElementAtMousePosition,
  updateCursorStyle,
  mouseIsNearPoint,
} from "./utils/mouse";
import { getComponentHierarcyFromElements } from "../calculations/getComponentHierarcyFromElements";

const { pressedKeys } = usePressedKeys();
const { canvasWidth, canvasHeight } = useCanvasSizes();
const {
  elements,
  createInitialBlock,
  resizeBlock,
  applyFinalChangesToBlock,
  createInitialArrow,
  resizeArrow,
  resizeInitialArrow,
  createInitialCircle,
} = useElements(pressedKeys);
const { scale, scaleOffset, updateScale } = useScaling();
const { panOffset, startPanMousePosition, handlePanning } = usePanning();
const { clientX, clientY, updateMousePosition } = useMousePosition(
  scale,
  scaleOffset,
  panOffset
);
const { currentAction } = useAction();
const { currentTool } = useTool();
const { movableElement, startMoving, moveBlock, moveArrow, moveCircle } =
  useMovable(elements, clientX, clientY);

const resizebleElement = ref(null);
const inputText = ref("");
const inputTextRef = ref(null);
const editableElement = ref(null);
const isEditingId = ref(false);

const updateCanvas = () => {
  const canvasElement = document.getElementById("scheme-canvas");
  const canvasContext = canvasElement.getContext("2d");
  const roughCanvas = rough.canvas(canvasElement);
  const scaledWidth = canvasElement.width * scale.value;
  const scaledHeight = canvasElement.height * scale.value;

  canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);

  scaleOffset.value = {
    x: (scaledWidth - canvasElement.width) / 2,
    y: (scaledHeight - canvasElement.height) / 2,
  };

  canvasContext.save();

  canvasContext.translate(
    panOffset.value.x * scale.value - scaleOffset.value.x,
    panOffset.value.y * scale.value - scaleOffset.value.y
  );

  canvasContext.scale(scale.value, scale.value);

  elements.value.forEach((element) => {
    if (element.type === ELEMENT_TYPE.BLOCK) {
      drawBlock(roughCanvas, canvasContext, element);
    }

    if (element.type === ELEMENT_TYPE.ARROW) {
      drawArrow(roughCanvas, canvasContext, element);
    }

    if (element.type === ELEMENT_TYPE.CIRCLE) {
      drawCircle(roughCanvas, element);
    }
  });

  localStorage.setItem("NOTATION_ELEMENTS", JSON.stringify(elements.value));

  canvasContext.restore();
};

const handleMouseDown = (event) => {
  if (event.button === 2) {
    return;
  }

  if (event.button === MIDDLE_BUTTON_ID) {
    currentAction.value = ACTION.PANNING;
    startPanMousePosition.value = { x: clientX.value, y: clientY.value };
    updateCanvas();
    return;
  }

  if (currentAction.value === ACTION.WRITING) {
    const editableElementCopy = {
      ...editableElement.value,
      text: isEditingId.value ? editableElement.value.text : inputText.value,
      blockId:
        editableElement.value.type === ELEMENT_TYPE.ARROW
          ? null
          : isEditingId.value
          ? inputText.value
          : editableElement.value.blockId,
    };

    elements.value = elements.value.filter(
      (el) => el.id !== editableElementCopy.id
    );

    elements.value.push(editableElementCopy);

    editableElement.value = null;
    isEditingId.value = false;
    currentAction.value = ACTION.NONE;

    updateCanvas();

    return;
  }

  if (currentTool.value === TOOL.RESIZE) {
    const element = getElementAtMousePosition(
      clientX.value,
      clientY.value,
      elements.value
    );

    if (element) {
      if (element.type === ELEMENT_TYPE.BLOCK) {
        if (
          mouseIsNearPoint(
            clientX.value,
            clientY.value,
            element.points.x2,
            element.points.y2
          )
        ) {
          resizebleElement.value = element;
          currentAction.value = ACTION.RESIZING;
        }
      }

      if (element.type === ELEMENT_TYPE.ARROW) {
        if (
          mouseIsNearPoint(
            clientX.value,
            clientY.value,
            element.points[element.points.length - 1].x,
            element.points[element.points.length - 1].y
          )
        ) {
          resizebleElement.value = element;
          currentAction.value = ACTION.RESIZING;
        }
      }
    }
  }

  if (currentTool.value === TOOL.SELECTION) {
    const element = getElementAtMousePosition(
      clientX.value,
      clientY.value,
      elements.value
    );

    if (element) {
      startMoving(element);
      movableElement.value = element;
      currentAction.value = ACTION.MOVING;
    }

    return;
  }

  if (currentTool.value === TOOL.DELETE) {
    const element = getElementAtMousePosition(
      clientX.value,
      clientY.value,
      elements.value
    );

    if (element) {
      elements.value = elements.value.filter((el) => el.id !== element.id);
      updateCanvas();
      return;
    }
  }

  if (currentTool.value === TOOL.TEXT) {
    const element = getElementAtMousePosition(
      clientX.value,
      clientY.value,
      elements.value
    );

    if (element) {
      if (element.type === ELEMENT_TYPE.BLOCK) {
        editableElement.value = element;

        if (
          mouseIsNearPoint(
            clientX.value,
            clientY.value,
            element.points.x1 + 5,
            element.points.y1 + 5
          )
        ) {
          isEditingId.value = true;
          inputText.value = element.blockId;
        } else {
          isEditingId.value = false;
          inputText.value = element.text;
        }

        currentAction.value = ACTION.WRITING;

        setTimeout(() => {
          inputTextRef.value.focus();
        }, 0);
      }

      if (element.type === ELEMENT_TYPE.ARROW) {
        editableElement.value = element;
        currentAction.value = ACTION.WRITING;
        inputText.value = element.text;

        setTimeout(() => {
          inputTextRef.value.focus();
        }, 0);
      }
    }
  }

  if (currentTool.value === TOOL.BLOCK) {
    createInitialBlock(clientX.value, clientY.value);
    currentAction.value = ACTION.CREATING;
  }

  if (currentTool.value === TOOL.ARROW) {
    createInitialArrow(clientX.value, clientY.value);
    currentAction.value = ACTION.CREATING;
  }

  if (currentTool.value === TOOL.CIRCLE) {
    createInitialCircle(clientX.value, clientY.value);
  }

  updateCanvas();
};

const handleMouseMove = (event) => {
  updateMousePosition(event);
  updateCursorStyle(
    event,
    clientX.value,
    clientY.value,
    currentTool.value,
    elements.value
  );

  if (currentAction.value === ACTION.PANNING) {
    handlePanning(clientX.value, clientY.value);
    updateCanvas();
    return;
  }

  if (currentAction.value === ACTION.MOVING) {
    const movableElementCopy = { ...movableElement.value };

    if (movableElementCopy.type === ELEMENT_TYPE.BLOCK) {
      moveBlock(movableElementCopy);
    }

    if (movableElementCopy.type === ELEMENT_TYPE.ARROW) {
      moveArrow(movableElementCopy);
    }

    if (movableElementCopy.type === ELEMENT_TYPE.CIRCLE) {
      moveCircle(movableElementCopy);
    }

    updateCanvas();
  }

  if (currentAction.value === ACTION.CREATING) {
    if (currentTool.value === TOOL.BLOCK) {
      resizeBlock(
        clientX.value,
        clientY.value,
        elements.value[elements.value.length - 1]
      );
    }

    if (currentTool.value === TOOL.ARROW) {
      resizeInitialArrow(clientX.value, clientY.value);
    }

    updateCanvas();
  }

  if (currentAction.value === ACTION.RESIZING) {
    if (resizebleElement.value.type === ELEMENT_TYPE.BLOCK) {
      resizeBlock(clientX.value, clientY.value, resizebleElement.value);
    }

    if (resizebleElement.value.type === ELEMENT_TYPE.ARROW) {
      resizeArrow(clientX.value, clientY.value, resizebleElement.value);
    }

    updateCanvas();
  }
};

const handleMouseUp = () => {
  if (
    currentAction.value === ACTION.CREATING &&
    currentTool.value === TOOL.BLOCK
  ) {
    applyFinalChangesToBlock(elements.value[elements.value.length - 1]);
  }

  if (
    currentAction.value === ACTION.RESIZING &&
    resizebleElement.value.type === ELEMENT_TYPE.BLOCK
  ) {
    applyFinalChangesToBlock(resizebleElement.value);
  }

  updateCanvas();

  if (currentAction.value === ACTION.WRITING) {
    return;
  }

  currentAction.value = ACTION.NONE;
  movableElement.value = null;
  resizebleElement.value = null;
};

const handleWheel = (event) => {
  updateScale(event.deltaY);
  updateCanvas();
};

const handleClear = () => {
  elements.value = [];
  updateCanvas();
};

const handleGenerate = () => {
  console.log("START GENERATE");
  try {
    getComponentHierarcyFromElements([...elements.value]);
  } catch (error) {
    console.log("GENERATION FAILED");
    console.log(error);
  }
  console.log("STOP GENERATE");
};

const handleSubmitWritingForm = () => {};

onMounted(() => {
  // elements.value = JSON.parse(localStorage.getItem("NOTATION_ELEMENTS"));
  updateCanvas();
});
</script>

<template>
  <div class="relative w-screen h-screen">
    <canvas
      id="scheme-canvas"
      class="absolute inset-0"
      :width="canvasWidth"
      :height="canvasHeight"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @wheel="handleWheel"
    ></canvas>
    <div class="absolute bottom-0 left-0 text-lg">
      <span class="space-x-4">
        <span v-for="tool in TOOL" class="space-x-2">
          <input
            type="radio"
            :checked="currentTool === tool"
            @change="currentTool = tool"
          />
          <span>{{ tool }}</span>
        </span>
        <button @click="handleClear">CLEAR</button>
        <button @click="handleGenerate">GENERATE</button>
      </span>
    </div>
    <div class="absolute bottom-8 right-8">
      <form
        v-if="currentAction === ACTION.WRITING"
        class="border-b-2 border-b-black flex items-center justify-center space-x-4"
        @submit.prevent="handleSubmitWritingForm"
      >
        <div>Text:</div>
        <input
          type="text"
          ref="inputTextRef"
          v-model="inputText"
          class="outline-none"
        />
      </form>
    </div>
  </div>
</template>
