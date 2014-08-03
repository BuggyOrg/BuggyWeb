
function drawGraph(graph, selector, base){
  var g = new dagreD3.Digraph();

  for(var i=0; i<graph.nodes.length; i++){
    g.addNode(graph.nodes[i].id, {label: graph.nodes[i].id});
  }

  for(var i=0; i<graph.connections.length; i++){
      g.addEdge(null, graph.connections[i].from.generic, graph.connections[i].to.generic);
  }

  var svg = d3.select(selector).append("svg").append("g");
  var renderer = new dagreD3.Renderer();
  var layout = dagreD3.layout()
                      .nodeSep(20);
  renderer.layout(layout).run(g, svg);
}
