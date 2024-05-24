import { ref } from "vue";
import { getMouseCoordinates } from "./utils/mouse";

export const useMousePosition = (scale, scaleOffset, panOffset) => {
  const clientX = ref(0);
  const clientY = ref(0);

  const updateMousePosition = (event) => {
    const mouseCoordinates = getMouseCoordinates(
      event,
      panOffset.value,
      scale.value,
      scaleOffset.value
    );

    clientX.value = mouseCoordinates.clientX;
    clientY.value = mouseCoordinates.clientY;
  };

  return {
    clientX,
    clientY,
    updateMousePosition,
  };
};
