( function(Dataflow) {

  var Search = Dataflow.prototype.plugin("buggy.search");
  var Symbol = Dataflow.prototype.node("symbol");

  Search.initialize = function(dataflow){
    var addNode = function(node, symbol, implementations, extensions, x, y) {
      return function(){
        // Deselect others
        dataflow.currentGraph.view.$(".dataflow-node").removeClass("ui-selected");

        // Current zoom
        zoom = dataflow.currentGraph.get('zoom');

        // Find vacant id
        var id = 1;
        while (dataflow.currentGraph.nodes.get(id)){
          id++;
        }
        // Position
        x = x===undefined ? 400 : x;
        y = y===undefined ? 200 : y;
        x = x/zoom - dataflow.currentGraph.get("panX");
        y = y/zoom - dataflow.currentGraph.get("panY");

        // Add node
        var newNode = new node.Model({
          id: id,
          x: x,
          y: y,
          parentGraph: dataflow.currentGraph,
          symbol: symbol,
          extensions: extensions,
          implementations: implementations
        });
        dataflow.currentGraph.nodes.add(newNode);
        // Select and bring to top
        newNode.view.select();
      };
    };

    Search.onSearch = function(text, callback){
      var BuggyPlugin = Dataflow.prototype.getPlugin("buggy");
      var results = BuggyPlugin.searchSemantics(text);

      //var results = Semantics.query(baseSemantics,text,{searchQuery:true},"symbols");
      var resultSymbols = _.map(results.symbols, function(item){
        var impls = BuggyPlugin.findImplementations(item.name);
        return {
          source: 'buggy.search',
          icon: 'cube',
          label: item.name,
          description: item.description,
          action: function () {
            var metas = BuggyPlugin.searchMeta(item.name, "BuggyWeb.NodeExtension");
            addNode(Symbol, item, impls, metas).call();
          }
        }});
      //results = Semantics.query(baseSemantics,text,{searchQuery:true},"modules");
      var resultModules = _.map(results.modules, function(item){
        return {
          source: 'buggy.search',
          icon: 'cubes',
          label: item.name,
          description: item.description,
          action: function () {
            console.log(item.name + " selected");
          }
        }});
      var resultItems = _.union(resultSymbols, resultModules);
      callback(resultItems);
    }
  }
}(Dataflow));
