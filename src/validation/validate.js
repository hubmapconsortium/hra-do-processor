import { validateDatasetGraph } from "./validate-ds-graph.js";

export function validate(context) {
  const { selectedDigitalObject: obj } = context;

  const processedType = obj.type;
  switch (processedType) {
    case 'ds-graph':
      validateDatasetGraph(context);
      break;
  }
}