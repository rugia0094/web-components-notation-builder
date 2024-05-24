import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../../tailwind.config.js";

export const getTailwindConfig = () => resolveConfig(tailwindConfig);

export const pxStringToNumber = (pxString) =>
  parseFloat(pxString.replace("px", ""));

export const remStringToNumber = (pxString) =>
  parseFloat(pxString.replace("rem", ""));
