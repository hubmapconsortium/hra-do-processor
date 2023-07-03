import { deriveLatest } from "./derive-latest.js";


export function finalize(context) {
  const obj = context.selectedDigitalObject;
  deriveLatest(context)
}
