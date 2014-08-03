( function(Dataflow) {

  var Node = Dataflow.prototype.module("node");
  var Code = Dataflow.prototype.plugin("buggyweb.coderender");

  var template = JadeTemplate("NodeInspectView");

  var makeEditable = function ($el, model, attribute) {
    $el[0].contentEditable = true;
    var initial = $el.text();
    var apply = function(){
      model.set(attribute, $el.text());
    };
    var revert = function(){
      $el.text(initial);
    };
    $el
      .focus(function(event){
        initial = $el.text();
      })
      .blur(function(event){
        apply();
      })
      .keydown(function(event){
        if (event.which === 27) {
          // ESC
          revert();
          $el.blur();
        } else if (event.which === 13) {
          // Enter
          $el.blur();
        }
      });
  };

  Node.InspectView = Backbone.View.extend({
    template: _.template(template),
    className: "dataflow-node-inspector",
    events: {
    },
    initialize: function(options) {
      this.$el.html(this.template(this.model.toJSON()));
      // Make input list
      var $inputs = this.$el.children(".dataflow-node-inspector-inputs");
      /*this.model.inputs.each(function(input){
        if (input.view && input.view.$input) {
          $inputs.append( input.view.$input );
        }
      }, this);*/

      var theModel = this.model;

      makeEditable(this.$(".dataflow-node-inspector-label"), this.model, "label");
      setTimeout(function(){
        var menu = $("#inspector_impl_dropdown_" + theModel.id);
        _.each(theModel.implementations, function(impl){
          var itemTmpl = _.template(JadeTemplate("NodeInspectView-ImplementationItem"));
          var implTmp = impl.implementation;
          if(impl.implementation){
            impl.implementation = Code.processCode(impl.implementation);
          }
          var append = itemTmpl(impl);
          menu.append(itemTmpl(impl));
          impl.implementation = implTmp;
        })
        $(".ui.dropdown").dropdown();
      },15);
    },
    render: function() {
      return this;
    },
    removeModel: function(){
      this.model.remove();
    }
  });

}(Dataflow) );
