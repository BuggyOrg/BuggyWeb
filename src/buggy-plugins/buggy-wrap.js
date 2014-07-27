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

// This file wraps the functional Buggy into an object for Backbone...

(function(Dataflow){

  var BuggyPlugin = Dataflow.prototype.plugin("buggy");

  BuggyPlugin.initialize = function(){
  }

  require(["ls!src/buggy", "ls!src/semantics"],
    function(Buggy,Semantics){

      var BuggyState = Backbone.Model.extend({
        defaults:{
          semantics: { }
        }
      });

      var buggyState = new BuggyState();


      var emptySemantics = Semantics.createSemantics();

      BuggyPlugin.addSemantics = function(name, semantics){
        semantics = $.extend(true,semantics,emptySemantics);
        var sem = buggyState.get("semantics");
        sem[name] = semantics;
        buggyState.set("semantics", sem);
      }

      BuggyPlugin.searchSemantics = function(search){
        var semantics = buggyState.get("semantics");
        var resultSymbols = _.map(semantics, function(val){
          return Semantics.query(val,search,{searchQuery:true},"symbols");
        });
        var resultModules = _.map(semantics, function(val){
          return Semantics.query(val,search,{searchQuery:true},"modules");
        });
        return {
          symbols: _.compact(_.flatten(resultSymbols)),
          modules: _.compact(_.flatten(resultModules))
        }
      }

      BuggyPlugin.searchMeta = function(name, type){
        var semantics = buggyState.get("semantics");
        var resultMeta = _.map(semantics, function(val){
          return Semantics.query(val,{type:type,name:name},{},"meta");
        });
        return flatten(resultMeta);
      }

      var mergeSemantics = function(s1,s2){
        var fullSemantics = s1;
        var s_keys = unique(union(keys(s1), keys(s2)));
        _.each(keys(s2), function(k){
          if(fullSemantics[k] instanceof Array){
            $.merge(fullSemantics[k],s2[k]);
          }else if(! (k in fullSemantics) ){
            fullSemantics[k] = $.merge([],s2[k]);
          }
        })
        return fullSemantics;
      }

      BuggyPlugin.fullSemantics = function(main_implementation){
        var semantics = values(buggyState.get("semantics"));
        var fullSemantics = _.reduce(semantics, function(acc, sem){
          var mgd = mergeSemantics(acc, sem);
          return mgd;
        }, {});
        console.log(fullSemantics);
        main_implementation.name = "main";
        // all + main semantics !
        var s = mergeSemantics(fullSemantics,{
          implementations:[
            main_implementation
          ]
        });
        console.log(semantics);
        return s;
      }

      BuggyPlugin.addSemantics("base", baseSemantics);

  });

}(Dataflow));
