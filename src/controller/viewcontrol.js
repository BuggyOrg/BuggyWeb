/* This file is part of BuggyWeb.
 
 BuggyWeb is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.
 
 BuggyWeb is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.
 
 You should have received a copy of the GNU General Public License
 along with BuggyWeb.  If not, see <http://www.gnu.org/licenses/>.
 */

var BuggyView = Dataflow.prototype.plugin("buggy.view");

$("#edit-group").click(function(){
  $("#edit-group-dimmer").dimmer("show");
});



$("#activeSymbolInput").css("display","none");
$("#activeSymbolInput").keyup(function(event){
  var name = $("#activeSymbolInput").val();
  if(event.keyCode == 13){
    $("#activeSymbolName").text(name);
    $("#activeSymbolInput").css("display","none");
    Controller.Switcher.deactivate();
  } else {
  }
});


var itemTmpl = _.template(JadeTemplate("SwitcherItem"));
var itemIDCounter = 0;
var createSelectionItem = function(impl){
  var itemID = itemIDCounter;
  itemIDCounter += 1;
  var html = itemTmpl({implementation: impl, id: "activeSelectionItem"+itemID});
  return { html: html, id: itemID, implementation: impl };
}

$("#activeSymbolInput").on('input', function(){
  var searchVal = $("#activeSymbolInput").val();
  var res = _.first(BuggyView.matchingSymbols(searchVal),5);
  var items = _.map(res, function(impl){
    return createSelectionItem(impl);
  });
  var itemHTML = _.reduce(items, function(items, cur){
    return items + cur.html;
  }, "");
  $("#switcherList").html(itemHTML);
  _.each(items, function(item){
    $("#activeSelectionItem"+item.id).click(function(){
      console.log(item.implementation.symbol + " clicked");
    });
  });
});

$("#changeActiveSymbol").click(function(){
  var name = $("#activeSymbolName").text();
  $("#activeSymbolInput").val(name);
  $("#activeSymbolInput").css("display","initial");
  
  Controller.Switcher.activate();
  
  $("#activeSymbolInput").focus();
});
