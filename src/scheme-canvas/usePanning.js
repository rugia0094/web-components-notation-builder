import { ref } from "vue";

export const usePanning = () => {
  const panOffset = ref({ x: 0, y: 0 });
  const startPanMousePosition = ref({ x: 0, y: 0 });

  const handlePanning = (clientX, clientY) => {
    const deltaX = clientX - startPanMousePosition.value.x;
    const deltaY = clientY - startPanMousePosition.value.y;

    panOffset.value = {
      x: panOffset.value.x + deltaX,
      y: panOffset.value.y + deltaY,
    };
  };

  return { panOffset, startPanMousePosition, handlePanning };
};
