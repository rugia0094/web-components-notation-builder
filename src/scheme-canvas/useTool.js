import { ref } from "vue";
import { TOOL } from "./constants";

export const useTool = () => {
  const currentTool = ref(TOOL.SELECTION);

  return {
    currentTool,
  };
};
