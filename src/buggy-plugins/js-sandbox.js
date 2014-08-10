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

// This file creates a sandbox for buggy programs via WebWorker. Each
// Buggy program is run in a WebWorker and has well defined inputs / outputs
// such that only data can be passed to the input / output interfaces.+
// Each WebWorker cannot access the DOM or invoke Javascript functions outside
// of the WebWorkers scope.
// In addition, a WebWorker won't interfer with the GUI and it can be killed
// from the program.

(function(Dataflow){

  var SandboxModule = Dataflow.prototype.plugin("buggy.js-sandbox");

  SandboxModule.initalize = function(dataflow){

  }

  // URL.createObjectURL
  window.URL = window.URL || window.webkitURL;

  var lastWorker = null;

  SandboxModule.create = function(code){
    if(lastWorker){
      lastWorker.terminate();
      lastWorker = null;
    }
    var blob;
    try {
        blob = new Blob([code], {type: 'application/javascript'});
    } catch (e) { // Backwards-compatibility
        console.error("Please use an up to date Browser...");
    }
    var worker = new Worker(URL.createObjectURL(blob));
    worker.onmessage = function(event){
      var msg = event.data;
      if(msg == "ready"){
      } else if(msg.type == "register" && msg.what == "input"){
        $("#input_button_" + msg.node).click(function(){
          var cnt = $("#input_"+msg.node).val();
          worker.postMessage({id:msg.node, content:cnt});
        });
      } else if(msg.type == "query-result"){
        if(msg.query == "non-empty-channels"){
          var state = "";
          for(id in msg.data){
            var pending = msg.data[id];
            if(pending.length > 0){
              state += "<div class='ui label'>" + id + "</div> : " + pending.length + ", ";
            }
          }
          $("#non-empty-channels-content").html(state.substring(0,state.length - 2));
        }
      } else if(msg.type == "output"){
        $("#output_" + msg.id).text(msg.content);
      }else {
        console.log(msg);
      }
    }
    worker.postMessage("start");

    $("#non-empty-channels").click(function(){
      worker.postMessage({type:"query",query:"non-empty-channels"});
    });

    lastWorker = worker;

  }

}(Dataflow));
