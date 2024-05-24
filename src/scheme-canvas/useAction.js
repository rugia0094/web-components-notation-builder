import { ref } from "vue";
import { ACTION } from "./constants";

export const useAction = () => {
  const currentAction = ref(ACTION.NONE);

  return {
    currentAction,
  };
};
