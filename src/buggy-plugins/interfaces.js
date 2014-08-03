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


/** This plugin defines Input / Output Symbols and implementations for
    Buggy.
 */
(function(Dataflow){

  var inout_semantics = {
    "implementations" : [
      {
        "symbol" : "Input",
        "name" : "Input",
        "module" : true,
        "atomic" : true,
        "language" : "javascript",
        "connectors" : [
          {
            "name" : "Value",
            "connector-type" : "Output",
            "data-type" : "string"
          }
        ],
        "external-dependencies" : "",
        "setup" : "",
        "input" : true,
        "implementation" : "input;",
        "explicit-callback" : true
      },
      {
        "symbol" : "Output",
        "name" : "Output",
        "module" : true,
        "atomic" : true,
        "language" : "javascript",
        "connectors" : [
          {
            "name" : "Value",
            "connector-type" : "Input",
            "data-type" : "string"
          }
        ],
        "external-dependencies" : "",
        "setup" : "",
        "implementation" : "output"
      }
    ],
    meta: [
      {
        "name" : "Input",
        "type" : "BuggyWeb.NodeExtension",
        "html" : JadeTemplate("InputControl")
      }
    ]
  };

  var InterfacesPlugin = Dataflow.prototype.plugin("buggy.interfaces");

  InterfacesPlugin.initialize = function(dataflow){
    var BuggyPlugin = Dataflow.prototype.getPlugin("buggy");

    BuggyPlugin.addSemantics("interfaces", inout_semantics);
  }

})(Dataflow);
