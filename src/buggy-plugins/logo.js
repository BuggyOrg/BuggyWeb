( function(Dataflow) {

  var Logo = Dataflow.prototype.plugin("buggy.logo");

  Logo.initialize = function(dataflow){
    var Buggy = dataflow.buggy;
    $("#version").html(Buggy.meta.version);
    $(".logo").addClass("visible");
  }
}(Dataflow));
