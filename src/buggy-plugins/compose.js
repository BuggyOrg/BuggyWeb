( function(Dataflow) {

  require(["ls!src/compose"], function(Compose){
    var ComposePlugin = Dataflow.prototype.plugin("buggy.compose");

    var clearColor = function(btn) {
      btn.removeClass("teal"); btn.removeClass("red"); btn.removeClass("green");
    }

    var enableInfos = function(code){
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

      $("#compose-info-button").removeClass("disabled");
      $("#compose-info-button").click(function(){
        $(".dimmer").dimmer("show");
        $(".dimmer").dimmer({
          onHide: function(){
            $("body").removeClass("ui");
            $("body").removeClass("dimmable");
          }
        })
      })
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

        enableInfos(code);
        successColorize(uiBtn);
      });
    }
  });
}(Dataflow));
