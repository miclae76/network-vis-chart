import { dimDesc, measureDesc } from './strings';

export default function data(env) {
  return {
    targets: [{
      path: '/qHyperCubeDef',
      dimensions: {
        min: 3,
        max: 4,
        description(properties, index) {
          return dimDesc[index];
        }
        /*
        1. Dimension: Node ID, numeric (Event ID or else) or String
        2. Dimension: Node Label
        3. Dimension: Node Parent ID, numeric (Event ID or else) or String
        4. Dimension: Node Cluster
        */
      },
      measures: {
        min: 0,
        max: 3,
        description(properties, index) {
          return measureDesc[index];
        }
        /*
        1. Measure: title text for tooltip (optional)
        2. Measure: node value
        3. Measure: edge value
        */
      }
    }]
  };
}