import { onMounted, onUnmounted, ref } from "vue";

export const usePressedKeys = () => {
  const pressedKeys = ref(new Set());

  const keyDownListener = (event) => pressedKeys.value.add(event.key);
  const keyUpListener = (event) => pressedKeys.value.delete(event.key);

  onMounted(() => {
    document.addEventListener("keydown", keyDownListener);
    document.addEventListener("keyup", keyUpListener);
  });

  onUnmounted(() => {
    document.removeEventListener("keydown", keyDownListener);
    document.removeEventListener("keyup", keyUpListener);
  });

  return {
    pressedKeys,
  };
};
