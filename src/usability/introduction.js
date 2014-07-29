( function(Dataflow) {

  var Intro = Dataflow.prototype.plugin("usability.introduction");

  var addPermanentPopup = function(id){
    $(id).popup("toggle");
    var elements = $("body").children();
    var popup = elements[elements.length - 1];
    $(popup).addClass("removeOnUnhover");
    $(id).popup("destroy");
    $("body").append(popup);
  }

  Intro.initialize = function(dataflow){
    var popups = [];
    $("#help-button").hover(function(){
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
      $("#compose-button").popup({
        position: "left center",
        title : "Compose Button",
        content: "Create your programs here!"
      });

      popups.push(addPermanentPopup("#searchfield"));
      //popups.push(addPermanentPopup("#settings"));
      popups.push(addPermanentPopup("#compose-button"));
    },function(){
      $(".removeOnUnhover").removeClass("animating");
      $(".removeOnUnhover").transition({
        animation: "scale out",
        complete: function(){
          $(this).remove();
        }
      });
    });
  }


}(Dataflow) );
