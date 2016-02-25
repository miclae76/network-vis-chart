<h2>Qlik Sense extension to visualize networks data</h2>

Based on library vis.js (http://visjs.org)
<br>Tested with Qlik Sense 2.2.3.

<h3>Setup</h3>

<h3>Dimensions</h3>
4 dimensions are mandatory :
<ol>
  <li>node identifier</li>
  <li>node label</li>
  <li>node parent identifier</li>
  <li>node group</li> 
</ol>

<h3>Measures</h3>
The measures are optional 
<ol>
  <li>tooltip : expression that will be push in the tooltip when hover on a node</li>
  <li>node value : used to scale the node size</li>
  <li>edge value : used to scale the edge width</li>
</ol>

<h3>Additional network settings</h3>
