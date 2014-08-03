
function drawGraph(graph, selector, base){
  var g = new dagreD3.Digraph();

  for(var i=0; i<graph.nodes.length; i++){
    g.addNode(graph.nodes[i].id, {label: graph.nodes[i].id});
  }

  for(var i=0; i<graph.connections.length; i++){
    var from = graph.connections[i].from.generic;
    var to = graph.connections[i].to.generic;
    if(base == from){
      from = base + ":" + graph.connections[i].from.connector;
      if(!(from in g._nodes)){
        g.addNode(from, {label: from});
      }
    }
    if(base == to){
      to = base + ":" + graph.connections[i].to.connector;
      if(!(to in g._nodes)){
        g.addNode(to, {label: to});
      }
    }
    g.addEdge(null, from, to);
  }

  var svg = d3.select(selector).append("svg").append("g");
  var renderer = new dagreD3.Renderer();
  var layout = dagreD3.layout()
                      .nodeSep(20);
  renderer.layout(layout).run(g, svg);
}
