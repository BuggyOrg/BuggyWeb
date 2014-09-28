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


// This part should probably become a separate Buggy Repository ?
(function(Dataflow){

  var BuggyLanguages = Dataflow.prototype.plugin("buggy.languages");
  
  var languages = [];
  
  BuggyLanguages.register = function(language){
    languages.push(language);
  }
  
  BuggyLanguages.transpile = function(what, from, to){
    if(from != "dataflow" && to != "dataflow"){
      // there must always be a way to transform to the dataflow Description
      // with that we can transpile from everywhere to everywhere
      var flow = this.transpile(what, from, "dataflow");
      return this.transpile(flow, "dataflow", to);
    }
    var functionSelect = "dataToCode";
    var lang = to;
    if(to == "dataflow"){
      functionSelect = "codeToData";
      lang = from;
    }
    var transpiler = _.first(_.filter(languages, function(l){ return l.name == lang; }));
    return transpiler[functionSelect](what);
  }

}(Dataflow));
