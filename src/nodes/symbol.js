( function(Dataflow) {

  // Dependencies
  var BaseResizable = Dataflow.prototype.node("base-resizable");
  var Symbol = Dataflow.prototype.node("symbol");

  Symbol.Model = BaseResizable.Model.extend({
    initialize: function(options){
      var sym = options.symbol;
      this.inputs = _.compact(_.map(sym.connectors, function(c){
        if(c.type=="Input"){
          return { id: c.name, type: "all" }
        } else {
          return null;
        }
      }));
      this.outputs = _.compact(_.map(sym.connectors, function(c){
        if(c.type=="Output" || c.type == "Generator"){
          return { id: c.name, type: "all" }
        } else {
          return null;
        }
      }));
      this.set("label", sym.name);
      this.extensions = options.extensions;
      BaseResizable.Model.prototype.initialize.call(this);
    },
    defaults: function(){
      var defaults = BaseResizable.Model.prototype.defaults.call(this);
      defaults.type = "symbol";
      defaults.w = 200;
      defaults.h = NaN; // Well, that works and the node is as high as it should be
      return defaults;
    },
  });

  Symbol.View = BaseResizable.View.extend({
    initialize: function(options){
      BaseResizable.View.prototype.initialize.call(this, options);
    }
  });



}(Dataflow) );
