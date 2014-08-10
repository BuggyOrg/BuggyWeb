( function(Dataflow) {

  require(["ls!src/compose"], function(Compose){
    var ComposePlugin = Dataflow.prototype.plugin("buggy.compose");
      var Sandbox = Dataflow.prototype.plugin("buggy.js-sandbox");

    var doDebug = false;

    var clearColor = function(btn) {
      btn.removeClass("teal"); btn.removeClass("red"); btn.removeClass("green");
    }

    var startWorker = function(code){
      Sandbox.create(code);
    }

    var cutCode = function(js){
      var start = js.indexOf("//##content#begin");
      if(start == -1) {start = 0;}
      else {start += "//##content#begin".length}
      var end = js.indexOf("//##content#end");
      if(end == -1) {end = js.length;}
      return js.substring(start,end);
    }

    var enableInfos = function(js, graph){
      var code = cutCode(js);
      $(".compose-code").text(code);
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
      var composeInfoHTML = $("#compose-info")[0].innerHTML;
      $(".ui.accordion").accordion({
        exclusive: true,
        onOpen: function(){
          var newContent = this.children(".newTitle")[0];
          var iconHTML = "<i class=\""+ $(newContent).attr("data-iconclass")+"\"></i>";
          $("#compose-info").html(iconHTML + newContent.innerHTML);
        },
        onClose: function(){
          $("#compose-info").html(composeInfoHTML);
        }
      });

      $("#dep-graph-render").html("");
      drawGraph(graph, "#dep-graph-render", "main", true);
      var svg = $("#dep-graph-render").children("svg");
      svg.attr("class","dagre");
      $("#dep-graph").html("");
      $("#dep-graph").append(svg);

      $("#fail-dimmer").css("visibility", "hidden");
      $("#success-dimmer").dimmer("visibility", "visible");
      $("#compose-info-button").removeClass("disabled");
      $("#compose-info-button").click(function(){
        $("#success-dimmer").dimmer("show");
      })
    }

    var enableFailInfos = function(error){
      $("#fail-dimmer-error-content").text(error.message);

      $("#fail-dimmer").css("visibility", "visible");
      $("#success-dimmer").dimmer("visibility", "hidden");
      $("#compose-info-button").removeClass("disabled");
      $("#compose-info-button").click(function(){
        $("#fail-dimmer").dimmer("show");
      });
      $("#fail-dimmer").dimmer("show");
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
        try {
          var options = {language: "javascript",construction:"js-csp-worker", debug:doDebug};
          var code = Compose.compose(semantics, options);
          var graph = Compose.createDependencyGraph(semantics, options);

          enableInfos(code, graph);
          successColorize(uiBtn);
          startWorker(code);
        }
        catch(e){
          enableFailInfos(e);
          failColorize(uiBtn);
          throw(e);
        }
      });
      var dropd = $("#compose-dropdown");
      $("#compose-debug").click(function(){ doDebug = true; dropd.removeClass("positive"); dropd.addClass("negative"); });
      $("#compose-no-debug").click(function(){ doDebug = false;  dropd.removeClass("negative"); dropd.addClass("positive"); });
      var BuggyPlugin = Dataflow.prototype.getPlugin("buggy");
      var cons = BuggyPlugin.listConstructions();
      var menu = $("#compose-construction-menu");
      _.map(BuggyPlugin.listConstructions(), function(c){
        menu.append("<div class='item'>" + c.name + " <span style='color:gray'>(" + c.language + ")</span></div>");
      });
      $("#compose-construction .text").html(cons[0].name + " <span style='color:gray'>(" + cons[0].language + ")</span>");
      $("#compose-construction").dropdown();
    }
  });
}(Dataflow));
