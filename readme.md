<h2>Qlik Sense extension to visualize networks data</h2>
<hr>
Based on library vis.js (http://visjs.org)
<br>Tested with Qlik Sense 2.2.3.
<hr>
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
<ul>
<li>Edge Type : select type of curve between nodes</li>
<li>Node Shape : dot, square, diamond, triangle ...</li>
<li>Display Edge Value : switch to display the measures on edge curves</li>
<li>Position Edge Label : top, bottom, middle, horizontal</li>
<li>Display Shadow : switch to enable shadow effects behind edge and nodes</li>
</ul>
