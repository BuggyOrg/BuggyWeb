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
  
  var BuggyView = Dataflow.prototype.plugin("buggy.view");
  var BuggyLanguages = Dataflow.prototype.plugin("buggy.languages");
  
  BuggyView.addView({
    name: "Functional",
    selectable: true,
    display: function(view){
      var impl = view.implementation;
      if(view.active.name == "Functional" && impl.type == "dataflow"){
        $("#functional-container").css("visibility", "visible");
        var editor = ace.edit("functional-content");
        editor.setTheme("ace/theme/monokai");
        editor.getSession().setMode("ace/mode/livescript");
        editor.setValue(BuggyLanguages.transpile(impl, "dataflow", "functional"));
        editor.setFontSize(18);
        editor.getSession().setTabSize(2);
        editor.getSession().setUseWrapMode(true);
        editor.on("change", function(){
          var impl = BuggyLanguages.transpile(editor.getValue(), "functional", "dataflow");
          if(!impl){
            $("#code-status").removeClass("green").addClass("inverted").addClass("red");
          } else {
            $("#code-status").removeClass("red").addClass("inverted").addClass("green");
            console.log(impl);
          }
        });
      } else {
        $("#functional-container").css("visibility", "hidden");
      }
    }
  });
  
}(Dataflow));
