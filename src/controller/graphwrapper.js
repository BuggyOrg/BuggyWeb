/* This file is part of Buggy.
 
 Buggy is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 Buggy is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with Buggy.  If not, see <http://www.gnu.org/licenses/>.
 */
 

 
(function(Dataflow){
  
  var DisplayGraph = Dataflow.prototype.plugin("buggy.display-graph");
  var BuggyPlugin = Dataflow.prototype.getPlugin("buggy");
  
  var counter = 0;
  
  var idOfNode = function(node){
    if("id" in node){
      return node.id;
    }
    return node.name;
  }
  var nodeID = function(node, map){
    var id = idOfNode(node);
    if(!(id in map)){
      map[id] = counter++;
    }
    return map[id];
  }
  
  var symbolNode = function(name, node, mapping){
    return {
      label: name,
      id: nodeID(node, mapping),
      type: "symbol",
      x: 200,
      y: 200,
      extensions: {},
      symbol: BuggyPlugin.getSymbol(name),
      implementations: BuggyPlugin.findImplementations(name)
    };
  }
  
  DisplayGraph.initialize = function(dataflow){
    DisplayGraph.addNode = function(node){
        
    };
    DisplayGraph.clearGraph = function(node){
        var g = dataflow.loadGraph({});
        g.trigger("change");
    };
    DisplayGraph.loadGraph = function(graph){
      var nodeMapping = {};
      var groupNode = symbolNode(graph.symbol, {id:graph.symbol}, nodeMapping);
      var displayGraph = {
        nodes : _.map(graph.generics, function(g){
          return symbolNode(g.name, g, nodeMapping);
        }),
        edges: _.map(graph.connections, function(c){
          return {
            source:{ node: nodeMapping[c.from.generic], port: c.from.connector},
            target:{ node: nodeMapping[c.to.generic], port: c.to.connector }
          }
        })
      };
      displayGraph.nodes = _.union(displayGraph.nodes, groupNode);
      var graph = dataflow.loadGraph(displayGraph);
      graph.trigger('change');
    };
  };
}(Dataflow));
