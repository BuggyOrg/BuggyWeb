( function(Dataflow) {

  var Search = Dataflow.prototype.plugin("buggy.search");


  Search.initialize = function(dataflow){
    var Buggy = dataflow.buggy;

    Search.onSearch = function(text, callback){
      console.log(Buggy);
      Buggy.searchSemantics(text, function(result) {
        console.log(result);
      });
    }
  }
}(Dataflow));
