import { defineStore } from "pinia";

export const useRemToPxStore = defineStore("RemToPxStore", () => {
  const fontSize = parseInt(
    window.getComputedStyle(document.documentElement).fontSize.replace("px", "")
  );

  const remToPx = (rem) => rem * fontSize;

  return {
    remToPx,
  };
});
