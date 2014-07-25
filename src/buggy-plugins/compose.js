( function(Dataflow) {

  require(["ls!src/compose"], function(Compose){
    var ComposePlugin = Dataflow.prototype.plugin("buggy.compose");

    var clearColor = function(btn) {
      btn.removeClass("teal"); btn.removeClass("red"); btn.removeClass("green");
    }

    var enableInfos = function(){
      $("#compose-info-button").removeClass("disabled");
    }

    var successColorize = function(btn){
      clearColor(btn);
      btn.addClass("green");
    }
    var failColorize = function(btn){
      clearColor(btn);
      btn.addClass("red");
    }
    var pendingColorize = function(btn){
      clearColor(btn);
      btn.addClass("blue");
    }

    ComposePlugin.initialize = function(dataflow){
      var uiBtn = $("#compose-button");
      uiBtn.click(function(){
        var BuggyPlugin = Dataflow.prototype.getPlugin("buggy");

        var mainImpl = dataflow.graph.toBuggyGroup();
        var semantics = BuggyPlugin.fullSemantics(mainImpl);
        var code = Compose.compose(semantics, {language: "javascript"});

        enableInfos();
        successColorize(uiBtn);
      });
    }
  });
}(Dataflow));
