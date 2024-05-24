import { computed } from "vue";

export const useCanvasSizes = () => {
  const canvasWidth = computed(() => window.innerWidth);
  const canvasHeight = computed(() => window.innerHeight);

  return {
    canvasWidth,
    canvasHeight,
  };
};
