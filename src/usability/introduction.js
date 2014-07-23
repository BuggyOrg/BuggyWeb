( function(Dataflow) {

  var Intro = Dataflow.prototype.plugin("usability.introduction");

  Intro.initialize = function(dataflow){
    $(function(){
      $("#settings").popup({
        position : "right center",
        title : "Settings",
        content : "You can find all the controls here."
      });
      $("#searchfield").popup({
        position: "bottom center",
        title : "Search Bar",
        content: "Search here for implementations"
      });

      $("#searchfield").popup("toggle");
      setTimeout(function(){
        $("#settings").popup("toggle");
        $("#searchfield").popup("destroy");
        setTimeout(function(){
          $("#settings").popup("destroy");
        },2000)
      }, 2000);
    });
  }


}(Dataflow) );
