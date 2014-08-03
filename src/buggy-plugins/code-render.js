( function(Dataflow) {

  var CodePlugin = Dataflow.prototype.plugin("buggyweb.coderender");

  var codeTemplates = {
    "input" : "blue",
    'input-data' : "blue",
    'output' : "green",
    'output-data' : "green",
    'set-meta':"teal",
    'has-meta' : "teal",
    'meta-query' : "teal",
    'node-meta' : "teal",
    'node-meta-to-string' : "teal",
    'metadata' : "teal",
    'merge-meta' : "teal"
  }
  var reg = /{{(.*?)}}/g

  CodePlugin.initialize = function(){

  }

  var tmpl = _.template(JadeTemplate("CodeTemplate"));

  CodePlugin.processCode = function(code){
    var parts = code.split(reg);
    var newParts = _.map(parts,function(val,i){
      if(i %2 == 1){
        var name = val.split(" ")[0];
        var color = (name in codeTemplates) ? codeTemplates[name] : "red";
        return tmpl({inner: "{{"+val+"}}", color: color});
      }
      return val;
    });
    var newCode = _.reduce(newParts, function(memo,val){
      return memo + val;
    }, "");
    return newCode;
  }

}(Dataflow));
