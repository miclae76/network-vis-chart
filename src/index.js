/*
Created by Michael Laenen - michael.laenen@agilos.com - (c) 2016
Tested on Qlik Sense 2.2.3

Agilos.com takes no responsibility for any code.
Use at your own risk.
*/
import "@babel/polyfill";
import paint from './paint';

const component = {
  initialProperties: {
    version: 1.0,
    qHyperCubeDef: {
      qDimensions: [],
      qMeasures: [],
      qInitialDataFetch: [{
        qWidth: 7,
        qHeight: 1400
      }]
    }
  },
  //property panel
  data: {
    dimensions: {
      min: 4,
      max: 4
      /*
      1. Dimension: Node ID, numeric (Event ID or else) or String
      2. Dimension: Node Label
      3. Dimension: Node Parent ID, numeric (Event ID or else) or String
      4. Dimension: Node Cluster
      */
    },
    measures: {
      min: 0,
      max: 3
      /*
      1. Measure: title text for tooltip (optional)
      2. Measure: node value
      3. Measure: edge value
      */
    }
  },
  definition: {
    type: "items",
    component: "accordion",
    items: {
      data: {
        uses: "data",
        sorting: {
          uses: "sorting"
        },
        addons: {
          uses: "addons",
          items: {
            dataHandling: {
              uses: "dataHandling"
            }
          }
        },
      },
      settings: {
        type: "items",
        label: "Settings",
        items: {
          edgeType: {
            ref: "edgeType",
            type: "string",
            component: "dropdown",
            label: "Egde Type",
            options: [
              { value: 'dynamic' },
              { value: 'continuous' },
              { value: 'discrete' },
              { value: 'diagonalCross' },
              { value: 'straightCross' },
              { value: 'horizontal' },
              { value: 'vertical' },
              { value: 'curvedCW' },
              { value: 'curvedCCW' },
              { value: 'cubicBezier' }
            ],
            defaultValue: "dynamic"
          },
          displayEdgeLabel : {
            ref: "displayEdgeLabel",
            type: "boolean",
            component: "switch",
            label: "Display Edge Value",
            options: [{
              value: true,
              label: "On"
            }, {
              value: false,
              label: "Off"
            }],
            defaultValue: false
          },
          posEdgeLabel: {
            ref: "posEdgeLabel",
            type: "string",
            component: "dropdown",
            label: "Position Edge Label",
            options: [
              { value: 'top' }, { value: 'middle' }, { value: 'bottom' }, { value: 'horizontal' }
            ],
            defaultValue: "top"
          },
          nodeShape: {
            ref: "nodeShape",
            type: "string",
            component: "dropdown",
            label: "Node Shape",
            options: [
              { value: 'dot' },
              { value: 'square' },
              { value: 'star' },
              { value: 'triangle' },
              { value: 'triangleDown' },
              { value: 'diamond' }
            ],
            defaultValue: "dot"
          },
          shadowMode: {
            ref: "shadowMode",
            type: "boolean",
            component: "switch",
            label: "Display Shadow",
            options: [{
              value: true,
              label: "On"
            }, {
              value: false,
              label: "Off"
            }],
            defaultValue: false
          }
        }
      }
    }
  },
  support: {
    export: true
  },
  snapshot: {
    canTakeSnapshot: true
  },
  paint: paint
};

export default component;
