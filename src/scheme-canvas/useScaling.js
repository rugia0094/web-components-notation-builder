import { ref } from "vue";

export const useScaling = () => {
  const scale = ref(1);
  const scaleOffset = ref({ x: 0, y: 0 });

  const updateScale = (deltaY) => {
    scale.value = Math.min(Math.max(scale.value + deltaY * -0.001, 0.1), 20);
  };

  return {
    scale,
    scaleOffset,
    updateScale,
  };
};
