import { Network } from 'vis/index-network';

function isTextCellNotEmpty(c) {
  return (c.qText && !(c.qIsNull || c.qText.trim() == ''));
}

function paint ( $element, layout ) {
  var _this = this,
    qData = layout.qHyperCube.qDataPages[0],
    id = layout.qInfo.qId,
    containerId = 'network-container_' + id;


  if(qData && qData.qMatrix) {
    $element.empty().append($('<div />')
      .attr({ id: containerId })
      .css({
        height: $element.height(),
        width: $element.width(),
        overflow: 'auto'
      }));

    var dataSet = qData.qMatrix.map(function(e){
      var dataItem = {
        id: e[0].qNum,
        label: e[1].qText,
        group: e[3].qText,
        parentid : e[2].qNum
      };

      // optional measures set
      if (e.length > 4) {
        // tooltip
        if (isTextCellNotEmpty(e[4])) {
          dataItem.title = e[4].qText;
        } else {
          dataItem.title = "*** Default Tooltip ***" + "<BR/>" + "Name:" + e[1].qText + "<BR/>" + "Group:" + e[3].qText;
        }
      }

      if (e.length > 5) {
        if (e[5].qNum) {
          // node value - to scale node shape size
          dataItem.nodeValue = e[5].qNum;
        }
      }

      if (e.length > 6) {
        if (e[6].qNum) {
          // edge value - to scale edge width
          dataItem.edgeValue = e[6].qNum;
        }
      }

      return dataItem;
    });

    // Require 2 arrays :  nodes and edges -  nodes array must be unique values of IDs !
    var uniqueId = [];
    var nodes = [];
    var edges = [];

    for(let i = 0; i< dataSet.length; i++){
      if (layout.displayEdgeLabel) {
        edges.push( { "from":dataSet[i].id, "to":dataSet[i].parentid, "value":dataSet[i].edgeValue, "label":dataSet[i].edgeValue } ); // with labels
      } else {
        edges.push( { "from":dataSet[i].id, "to":dataSet[i].parentid, "value":dataSet[i].edgeValue } ); // create edges
      }

      // process uniqueness
      if(uniqueId.indexOf(dataSet[i].id) === -1) {
        uniqueId.push(dataSet[i].id);

        var nodeItem = {
          "id": dataSet[i].id,
          "label": dataSet[i].label,
          "title": dataSet[i].title,
          "group": dataSet[i].group,
          "value": dataSet[i].nodeValue
        };
        nodes.push(nodeItem); // create node
      }
    }

    // create dataset for \\
    var data = {
      nodes: nodes,
      edges: edges
    };

    // create a network
    var container = document.getElementById(containerId);

    var options = {
      layout: {
        randomSeed: 1
      },
      nodes: {
        shape:layout.nodeShape,
        shadow:layout.shadowMode
      },
      edges: {
        shadow:layout.shadowMode,
        font: {
          align: layout.posEdgeLabel
        },
        smooth: {
          type: layout.edgeType
        }
      },
      interaction: {
        hideEdgesOnDrag: true,
        tooltipDelay: 100
      },
      physics: {
        forceAtlas2Based: {
          gravitationalConstant: -100,
          centralGravity: 0.005,
          springLength: 230,
          springConstant: 0.18
        },
        maxVelocity: 146,
        solver: 'forceAtlas2Based',
        timestep: 0.35,
        stabilization: { iterations: 150 }
      }
    };
    var network = new Network(container, data, options);

    // Handle Selection on 1-node
    $("#"+containerId).css('cursor','default');

    network.on('select', function (properties) {
      if (properties.hasOwnProperty("nodes")) {
        if (properties.nodes.length > 0) {
          // find connected nodes to selection
          var connectedNodes = network.getConnectedNodes(properties.nodes[0]);
          // append node to the array
          connectedNodes.push(properties.nodes[0]);

          //Make the selections
          _this.backendApi.selectValues(0,connectedNodes,false);
        }
      }
    });
  }
}

export default paint;
