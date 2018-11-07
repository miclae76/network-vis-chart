/*
Created by Michael Laenen - michael.laenen@agilos.com - (c) 2016
Tested on Qlik Sense 2.2.3

Agilos.com takes no responsibility for any code.
Use at your own risk. 
*/
var _extName = "network-vis-chart";
var _extPath = "extensions/" + _extName + "/";
var _extPathStyles = "/" + _extPath + "styles/";

define(["jquery", "qlik", "./scripts/vis.min"], 
function($, qlik, vis) {
	var cssFiles = [
			["vis","vis.min.css"]
		]

	// link css files in head
	$.each(cssFiles, function(index, value) {
		var idPattern = 'styleLinked_' + value[0];  
		if($('#' + idPattern).length === 0) {  
			var lnk = $('<link />').attr({
				id: idPattern,
				rel: "stylesheet", 
				href: _extPathStyles + value[1]
			}); 
			$("head").append(lnk);  
		}
	});
	
	return {
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
		definition: {
			type: "items",
			component: "accordion",
			items: {
				dimensions: {
					uses: "dimensions",
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
					uses: "measures",
					min: 0,
					max: 3
					/*
						1. Measure: title text for tooltip (optional)
                        2. Measure: node value
                        3. Measure: edge value				
					*/
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
					uses: "settings",
					items: {
						edgeType: {
							ref: "edgeType",
							type: "string",
							component: "dropdown",
							label: "Egde Type",
							options: 
								[ { value: 'dynamic' }, { value: 'continuous' }, { value: 'discrete' }, { value: 'diagonalCross' },
								  { value: 'straightCross' }, { value: 'horizontal' }, { value: 'vertical' }, { value: 'curveCW' },
								  { value: 'curveCCW' }, { value: 'cubicBezier' }
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
                            options: 
                                [ { value: 'top' }, { value: 'middle' }, { value: 'bottom' }, { value: 'horizontal' }
                                ],
                            defaultValue: "top"
                        },              
                        nodeShape: {
                            ref: "nodeShape",
                            type: "string",
                            component: "dropdown",
                            label: "Node Shape",
                            options: 
                                [ { value: 'dot' }, { value: 'square' }, { value: 'star' }, { value: 'triangle' }, { value: 'triangleDown' }, { value: 'diamond' }
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

		snapshot: {
			canTakeSnapshot: true
		},

		paint: function ( $element, layout ) {
			var _this = this,
				app = qlik.currApp();
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

//console.log(qData.qMatrix);				

				var dataSet = qData.qMatrix.map(function(e){
					// 
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
                        if (e[5].qNum)  {
                           // node value - to scale node shape size
                           dataItem.nodeValue = e[5].qNum;    
                        }
                    }

                    if (e.length > 6) {
                        if (e[6].qNum)  {
                           // edge value - to scale edge width
                           dataItem.edgeValue = e[6].qNum;    
                        }
                    }
					
					return dataItem;
				});
//console.log(dataSet);

                // Require 2 arrays :  nodes and edges -  nodes array must be unique values of IDs !
                var uniqueId = [];
                var nodes = [];
                var edges = [];

                for(i = 0; i< dataSet.length; i++){

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
                        nodes.push(nodeItem);    // create node 
                    }        
                }

//console.log(nodes);

/* // Debug, uncomment to use
var myJSON = JSON.stringify({nodes:nodes});
console.log(myJSON);
*/
                // create dataset for vis
    			var data = {
                    nodes: nodes,
                    edges: edges
                };
				
				// create a network
            	var container = document.getElementById(containerId);
	           
	            var options = {
	                nodes: {
	                    shape:layout.nodeShape,
                        shadow:layout.shadowMode
	                    //,size: 16
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
	                    stabilization: {iterations: 150}
	                }
	            };
	            var network = new vis.Network(container, data, options);
				
				
                // Handle Selection on 1-node
				$("#"+containerId).css('cursor','default');

				network.on('select', function (properties) {
					//console.log(properties);
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
	}
});

function isTextCellNotEmpty(c) {
	return (c.qText && !(c.qIsNull || c.qText.trim() == ''));
}
