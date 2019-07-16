/*
Created by Michael Laenen - michael.laenen@agilos.com - (c) 2016
Tested on Qlik Sense 2.2.3

Agilos.com takes no responsibility for any code.
Use at your own risk.
*/
if (!window._babelPolyfill) { // eslint-disable-line no-underscore-dangle
  require('@babel/polyfill'); // eslint-disable-line global-require
}

import paint from './paint';
import './styles/main.less';

const dimDesc = [
  "Node Identifier",
  "Node Label",
  "Node Parent",
  "Node Group"
];

const dimLongDesc = [
  "Node Identifier - a field in the dataset which should be presented as a node in the network diagram."
  + " these control the actual elements presented in the network diagram.",
  "Node Label - controls what field holds the data that described the nodes in the network"
  + " diagram. The field content will be presented as label.",
  "Node Parent - is used to determine the ancestor node for the individual nodes."
  + " This field will be used for describing the relationships between network elements.",
  "Node Group - is a field which describes groups of a node in the network."
  + " This is used to apply the same color to several nodes."
];

const measureDesc = [
  "Tooltip",
  "Node size",
  "Edge size"
];

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
  },
  definition: {
    type: "items",
    component: "accordion",
    items: {
      data: {
        uses: "data",
        items:{
          dimensions:{
            disabledRef: "",
            items: {
              helpDesc: {
                component: 'text',
                style: 'qlik-network-chart-italic-property',
                label: function(properties, handler) {
                  var index;
                  handler.getDimensions().forEach((element, i) => {
                    if(element.qDef.cId === properties.qDef.cId) {
                      index = i;
                    }
                  });
                  return dimLongDesc[index];
                }
              }
            }
          },
          measures: {
            disabledRef: ""
          }
        }
      },
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
      settings: {
        type: "items",
        label: "Settings",
        items: {
          edgeType: {
            ref: "edgeType",
            type: "string",
            component: "dropdown",
            label: "Edge Type",
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
      },
      about: {
        component: 'items',
        label: 'About',
        items: {
          header: {
            label: 'Network chart',
            style: 'header',
            component: 'text'
          },
          paragraph1: {
            label: `Network chart is Qlik Sense chart which allows you you draw a network of connected nodes and edges from a data set to a sheet.`,
            component: 'text'
          },
          paragraph2: {
            label: 'Network chart is based upon an extension created by Michael Laenen.',
            component: 'text'
          }
        }
      }
    }
  },
  support: {
    export: true,
    snapshot: false
  },
  snapshot: {
    canTakeSnapshot: false
  },
  paint: paint
};

export default component;
