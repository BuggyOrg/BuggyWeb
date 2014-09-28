/* This file is part of Buggy.
 
 Buggy is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 Buggy is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with Buggy.  If not, see <http://www.gnu.org/licenses/>.
 */

(function(Dataflow){
  
  var BuggyPlugin = Dataflow.prototype.plugin("buggy");
  var BuggyLanguages = Dataflow.prototype.plugin("buggy.languages");
  
  
  var name_of = function(c){ return c.name; };
  var connectorStr = function(sym, filter){
    var cArr = sym.connectors;
    var cs = _.filter(cArr, function(c){
      return c.type==filter;
    });
    cs = _.map(cs, function(c){
      return sym.name + "_" + name_of(c)
    });
    return cs.join(", ");
  }
  
  var astToHash = function(values, name){
    return _.chain(values)
      .filter(function(v){ return v.key.name == name; })
      .first().value();
  }
  
  var astToImpl = function(values, name){
    return _.chain(values)
      .filter(function(v){ return v.key.name == name; })
      .map(function(v){ console.log(v); return v.val.right.body.lines; })
      .first().value();
  }
  
  var isGeneric = function(v){
    return v.op == "=";
  }
  
  var toGeneric = function(v){
    return {
      name: v.right.head.value
    }
  }
  
  var isConnection = function(v){
    return "head" in v;
  }
  
  var toConnection = function(v){
    return {
      from: {
        generic: v.head.value.split("_")[0],
        connector: v.head.value.split("_")[1]
      },
      to: {
        generic: v.tails[0].args[0].body.lines[0].value.split("_")[0],
        connector: v.tails[0].args[0].body.lines[0].value.split("_")[1]
      }
    }
  }

  var lineEnding = "\n";
  var connectorTemplate = _.template("    <%=from.generic%>_<%=from.connector%> -> <%=to.generic%>_<%=to.connector%>");
  var genericTemplate = _.template("    [<%=outputs%>] = <%=name%> <%=inputs%>");
  var descTemplate = _.template("<%=name%> = {\n  symbol: <%=symbol%>\n  implementation: [<%=outputs%>] = (<%=inputs%>) ->\n<%=contents%>\n}")
  
  var funcLang = {
    name : "functional",
    description: "LiveScript like language",
    dataToCode: function(data){
      var symbol = BuggyPlugin.getSymbol(data.symbol);
      
      contents = _.map(data.connections, function(c){
        return connectorTemplate(c);
      }).join(lineEnding);
      contents += lineEnding + _.map(data.generics, function(g){
        var sym = BuggyPlugin.getSymbol(g.name);
        var outputs = connectorStr(sym, "Output");
        var inputs = connectorStr(sym, "Input");
        return genericTemplate({outputs:outputs, name: g.name, inputs: inputs});
      }).join(lineEnding);
      var outputs = connectorStr(symbol, "Output");
      var inputs = connectorStr(symbol, "Input");
      return descTemplate({name:data.name, outputs:outputs, inputs: inputs, contents:contents, symbol: data.symbol});
    },
    codeToData: function(code){
      try{
        var ast = LiveScript.ast(code);
        console.log(ast);
        var values = ast.lines[0].right.items;
        var impl = astToImpl(values, "implementation");
        var implementation = {
          name: ast.lines[0].left.value,
          symbol: astToHash(values, "symbol").val.value,
          generics: _.chain(impl)
            .filter(isGeneric)
            .map(toGeneric)
            .value(),
          connections: _.chain(impl)
            .filter(isConnection)
            .map(toConnection)
            .value()
        }
        return implementation;
      }catch(e){
        return false;
      }
    }
  };
  
  BuggyLanguages.register(funcLang);
  
}(Dataflow));
