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

  var SanboxModule = Dataflow.prototype.module("buggy.js-sandbox");


}(DataFlow));
