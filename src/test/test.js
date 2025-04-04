import { testDatasetGraph } from "./test-ds-graph.js";

export function test(context) {
  const { selectedDigitalObject: obj } = context;

  const processedType = obj.type;
  switch (processedType) {
    case 'ds-graph':
      testDatasetGraph(context);
      break;
  }
}