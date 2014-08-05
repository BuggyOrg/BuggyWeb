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
          var code = Compose.compose(semantics, {language: "javascript"});

          enableInfos(code);
          successColorize(uiBtn);
        }
        catch(e){
          enableFailInfos(e);
          failColorize(uiBtn);
        }
      });
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
