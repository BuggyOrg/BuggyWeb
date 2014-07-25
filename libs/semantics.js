baseSemantics = {"sources":[{"name":"Atomics","description":"Collection of Atomics necessary to evaluate all programs","uri":"semantics/atomics.json","type":"load"},{"name":"Functional","description":"Basic functional units like map,fold,scan,reduce","uri":"semantics/functional.json","type":"load"},{"name":"Documentation","description":"Documentation of basic semantic features","uri":"semantics/documentation.json","type":"load"},{"name":"Shells","description":"Definitions for specific shells","uri":"semantics/shells.json","type":"load"},{"name":"Modules","description":"Preprocess Modules","uri":"semantics/modules/math-module.json","type":"load"},{"name":"Atomics","description":"Standard implementation of atomics in Javascript","uri":"semantics/javascript/atomics.json","type":"load"},{"name":"Javascript CSP Construction","description":"CSP implementation of Javascript Buggy translation","uri":"semantics/javascript/js-csp.json","type":"load"},{"name":"Atomic Documentation","description":"Documentation of atomics","uri":"semantics/documentation/atomics.json","type":"load"}],"symbols":[{"name":"Identity","connectors":[{"name":"StreamIn","type":"Input"},{"name":"StreamOut","type":"Output"}]},{"name":"Add","description":"Adds two numbers","connectors":[{"name":"Term 1","type":"Input"},{"name":"Term 2","type":"Input"},{"name":"Sum","type":"Output"}]},{"name":"Constant","connectors":[{"name":"Value","type":"Generator"}]},{"name":"Select","connectors":[{"name":"Array","type":"Input"},{"name":"Selection","type":"Output"}]},{"name":"Set","connectors":[{"name":"Array","type":"Input"},{"name":"Value","type":"Input"},{"name":"ArrayOut","type":"Output"}]},{"name":"StringToArray","connectors":[{"name":"String","type":"Input"},{"name":"Array","type":"Output"}]},{"name":"Clone","connectors":[{"name":"Stream","type":"Input"},{"name":"Stream1","type":"Output"},{"name":"Stream2","type":"Output"}]},{"name":"Serialize","connectors":[{"name":"Array","type":"Input"},{"name":"Stream","type":"Output"}]},{"name":"Deserialize","connectors":[{"name":"Stream","type":"Input"},{"name":"Array","type":"Output"}]},{"name":"SyncFirst","connectors":[{"name":"SyncValue","type":"Input"},{"name":"SyncStream","type":"Input"},{"name":"Sync","type":"Output"}]},{"name":"Last","connectors":[{"name":"Stream","type":"Input"},{"name":"Last","type":"Output"}]},{"name":"Map","connectors":[{"name":"Array","type":"Input"},{"name":"Result","type":"Output"},{"name":"ArrayStreamOut","type":"Output"},{"name":"ResultStreamIn","type":"Input"}]},{"name":"Scan","connectors":[{"name":"Initial","type":"Input"},{"name":"Array","type":"Input"},{"name":"Result","type":"Output"},{"name":"Value1Out","type":"Output"},{"name":"Value2Out","type":"Output"},{"name":"ResultStreamIn","type":"Input"}]},{"name":"Fold","connectors":[{"name":"Initial","type":"Input"},{"name":"Array","type":"Input"},{"name":"Result","type":"Output"},{"name":"Value1Out","type":"Output"},{"name":"Value2Out","type":"Output"},{"name":"ResultStreamIn","type":"Input"}]},{"name":"Input","connectors":[{"name":"Value","type":"Output","data-type":"string"}]},{"name":"Output","connectors":[{"name":"Value","type":"Input","data-type":"string"}]},{"name":"CSPLoopControl","connectors":[{"name":"Stream","type":"Input"},{"name":"Initial","type":"Input"},{"name":"OutStream","type":"Output"}]}],"modules":[{"name":"MathParser","matches":"Math","process-file":"semantics/modules/processing/parse-math.ls","process":"/* This file is part of Buggy.\n\n Buggy is free software: you can redistribute it and/or modify\n it under the terms of the GNU General Public License as published by\n the Free Software Foundation, either version 3 of the License, or\n (at your option) any later version.\n\n Buggy is distributed in the hope that it will be useful,\n but WITHOUT ANY WARRANTY; without even the implied warranty of\n MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n GNU General Public License for more details.\n\n You should have received a copy of the GNU General Public License\n along with Buggy.  If not, see <http://www.gnu.org/licenses/>.\n */\n\n#%#[MathParser Module]\nmath = require \"mathjs\"\n\nrename = {\n  \"add\" : \"Add\",\n  \"constant\" : \"Constant\"\n}\n\nresults = {\n  \"add\" : \"Sum\",\n  \"constant\" : \"Value\"\n}\n\ninputs = {\n  \"add\" : [\"Term 1\", \"Term 2\"],\n}\n\nmath-id-counter = 0\n\nterm-to-term-name = (term) ->\n  if \"fn\" of term\n    term.fn\n  else if \"value\" of term\n    \"constant\"\n  else if \"name\" of term\n    \"input\"\n\nterm-to-meta = (term, generic) ->\n  switch term-to-term-name term\n  | \"constant\" => { Constant : { value: term.value } }\n  | \"input\"    => { is-input: true, input-of: generic.id }\n\nget-connector = (term, conn) ->\n  if conn == \"Result\"\n    results[term-to-term-name term]\n  else\n    inputs[term-to-term-name term][conn]\n\n\nterm-to-generic = (term) ->\n  if !(term.meta?) or !term.meta.isInput\n    {\n      name: rename[term.term-name]\n      id: \"math_\" + term.id\n      meta: term.meta\n    }\n\ncreate-connection = (t1, t2) ->\n  if t1.meta? && t1.meta.is-input\n    {\n      from: { generic: t1.meta.input-of, connector: t1.name  }\n      to: { generic: \"math_\" + t2.id, connector: get-connector t2, t1.connector-id}\n    }\n  else\n    {\n      from: { generic: \"math_\" + t1.id, connector: get-connector t1, \"Result\"  }\n      to: { generic: \"math_\" + t2.id, connector: get-connector t2, t1.connector-id}\n    }\n\ncreate-input = (term) ->\n  if term.meta && term.meta.is-input\n    { name: term.name, type: \"Input\" }\n\nterm-to-generic-list = (term) ->\n  if term.params?\n    subnodes = (term.params |> map -> term-to-generic-list it)\n    compact flatten (union [term-to-generic term], subnodes)\n  else\n    [term-to-generic term]\n\nterm-to-connection-list = (term) ->\n  if term.params?\n    flatten (term.params |> map ->\n      union (term-to-connection-list it), [create-connection it, term])\n  else\n    []\n\nterm-to-input-list = (term) ->\n  if term.params?\n    inputs = flatten (term.params |> map ->\n      term-to-input-list it)\n    compact union [create-input term], inputs\n  else\n    [create-input term]\n\npreprocess = (term, generic) ->\n  term.term-name = term-to-term-name term\n  term.id = math-id-counter\n  term.meta = term-to-meta term, generic\n  math-id-counter += 1\n  if term.params?\n    connector-id = 0\n    term.params |> each ->\n      it.connector-id = connector-id\n      preprocess it, generic\n      connector-id += 1\n  return term\n\nreturn (generic) ->\n  term = math.parse generic.module.term\n  term = preprocess term, generic\n\n  inputs = term-to-input-list term\n  inputs = union inputs, [{ name : \"Result\", type : \"Output\" }]\n  generics = term-to-generic-list term\n  connections = term-to-connection-list term\n  connections.push {\n    from: { generic: \"math_\" + term.id, connector: results[term.term-name] },\n    to: { generic: generic.id, connector: \"Result\" }\n  }\n\n  {\n    symbol: {\n      name : \"Math\",\n      id: generic.id\n      connectors : inputs\n    },\n    implementation: {\n      generics: generics\n      connections: connections\n    }\n  }\n"}],"implementations":[{"name":"Map","generics":[{"name":"Serialize","inputs":{"Array":">Map:Array"}},{"name":"Deserialize","inputs":{"Stream":">Map:ResultStreamIn"}}],"connections":[{"id":"Serialize:Stream -> Map:ArrayStreamOut","to":{"generic":"Map","connector":"ArrayStreamOut"},"from":{"generic":"Serialize","connector":"Stream"}},{"id":"Deserialize:Array -> Map:Result","to":{"generic":"Map","connector":"Result"},"from":{"generic":"Deserialize","connector":"Array"}},{"id":"Map:Array -> Serialize:Array","to":{"generic":"Serialize","connector":"Array"},"from":{"generic":"Map","connector":"Array"},"type":"Normal"},{"id":"Map:ResultStreamIn -> Deserialize:Stream","to":{"generic":"Deserialize","connector":"Stream"},"from":{"generic":"Map","connector":"ResultStreamIn"},"type":"Normal"}],"atomic":false},{"name":"Scan","generics":[{"name":"SyncFirst","inputs":{"SyncValue":">Scan:Initial","SyncStream":">Serialize:Stream"}},{"name":"Identity","inputs":{"StreamIn":">Scan:ResultStreamIn"}},{"name":"Serialize","inputs":{"Array":">Scan:Array"}},{"name":"Deserialize","inputs":{"Stream":">Scan:ResultStreamIn"}}],"connections":[{"id":"SyncFirst:Sync -> Scan:Value1Out","to":{"generic":"Scan","connector":"Value1Out"},"from":{"generic":"SyncFirst","connector":"Sync"}},{"id":"Serialize:Stream -> Scan:Value2Out","to":{"generic":"Scan","connector":"Value2Out"},"from":{"generic":"Serialize","connector":"Stream"}},{"id":"Identity:StreamOut -> Scan:Value1Out","to":{"generic":"Scan","connector":"Value1Out"},"from":{"generic":"Identity","connector":"StreamOut"}},{"id":"Deserialize:Array -> Scan:Result","to":{"generic":"Scan","connector":"Result"},"from":{"generic":"Deserialize","connector":"Array"}},{"id":"Scan:Initial -> SyncFirst:SyncValue","to":{"generic":"SyncFirst","connector":"SyncValue"},"from":{"generic":"Scan","connector":"Initial"},"type":"Normal"},{"id":"Serialize:Stream -> SyncFirst:SyncStream","to":{"generic":"SyncFirst","connector":"SyncStream"},"from":{"generic":"Serialize","connector":"Stream"},"type":"Normal"},{"id":"Scan:ResultStreamIn -> Identity:StreamIn","to":{"generic":"Identity","connector":"StreamIn"},"from":{"generic":"Scan","connector":"ResultStreamIn"},"type":"Normal"},{"id":"Scan:Array -> Serialize:Array","to":{"generic":"Serialize","connector":"Array"},"from":{"generic":"Scan","connector":"Array"},"type":"Normal"},{"id":"Scan:ResultStreamIn -> Deserialize:Stream","to":{"generic":"Deserialize","connector":"Stream"},"from":{"generic":"Scan","connector":"ResultStreamIn"},"type":"Normal"}],"atomic":false},{"name":"Fold","generics":[{"name":"Scan","inputs":{"Initial":">Fold:Initial","Array":">Fold:Array","ResultStreamIn":">Fold:ResultStreamIn"}},{"name":"Last","inputs":{"Stream":">Scan:Result"}}],"connections":[{"id":"Scan:Value1Out -> Fold:Value1Out","to":{"generic":"Fold","connector":"Value1Out"},"from":{"generic":"Scan","connector":"Value1Out"}},{"id":"Scan:Value2Out -> Fold:Value2Out","to":{"generic":"Fold","connector":"Value2Out"},"from":{"generic":"Scan","connector":"Value2Out"}},{"id":"Last:Last -> Fold:Result","to":{"generic":"Fold","connector":"Result"},"from":{"generic":"Last","connector":"Last"}},{"id":"Fold:Initial -> Scan:Initial","to":{"generic":"Scan","connector":"Initial"},"from":{"generic":"Fold","connector":"Initial"},"type":"Normal"},{"id":"Fold:Array -> Scan:Array","to":{"generic":"Scan","connector":"Array"},"from":{"generic":"Fold","connector":"Array"},"type":"Normal"},{"id":"Fold:ResultStreamIn -> Scan:ResultStreamIn","to":{"generic":"Scan","connector":"ResultStreamIn"},"from":{"generic":"Fold","connector":"ResultStreamIn"},"type":"Normal"},{"id":"Scan:Result -> Last:Stream","to":{"generic":"Last","connector":"Stream"},"from":{"generic":"Scan","connector":"Result"},"type":"Normal"}],"atomic":false},{"name":"Identity","language":"javascript","atomic":true,"implementation-file":"semantics/javascript/implementation/atomics/id.js","implementation":"{{output 'StreamOut'}} = {{input 'StreamIn'}};\n{{merge-meta 'StreamOut' 'StreamIn'}};\n"},{"name":"Add","language":"javascript","atomic":true,"implementation-file":"semantics/javascript/implementation/atomics/add.js","implementation":"{{merge-meta 'Sum' 'Term 1'}};\n{{merge-meta 'Sum' 'Term 2'}};\n{{output 'Sum'}} = Number({{input 'Term 1'}}) + Number({{input 'Term 2'}});\n"},{"name":"Constant","language":"javascript","atomic":true,"implementation-file":"semantics/javascript/implementation/atomics/constant.js","implementation":"{{output 'Value'}} = {{node-meta 'Constant.value'}};\n"},{"name":"Select","language":"javascript","atomic":true,"implementation-file":"semantics/javascript/implementation/atomics/select.js","implementation":"{{output 'Selection'}} = {{input 'Array'}}[{{node-meta 'Select.Selection'}}];\n"},{"name":"Set","language":"javascript","atomic":true,"implementation-file":"semantics/javascript/implementation/atomics/set.js","implementation":"var inArray = {{input 'Array'}};\ninArray[{{node-meta 'Set.Selection'}}] = {{input 'Value'}};\n{{output 'ArrayOut'}} = inArray;\n"},{"name":"StringToArray","language":"javascript","atomic":true,"implementation-file":"semantics/javascript/implementation/atomics/string-to-array.js","implementation":"if({{input 'String'}}.length == 0){\n  {{output 'Array'}} = []\n} else {\n  {{output 'Array'}} = String({{input 'String'}}).split(',');\n}\n"},{"name":"Clone","language":"javascript","atomic":true,"implementation-file":"semantics/javascript/implementation/atomics/clone.js","implementation":"{{output 'Stream1'}} = {{input 'Stream'}};\n{{merge-meta 'Stream1' 'Stream'}};\n{{output 'Stream2'}} = {{input 'Stream'}};\n{{merge-meta 'Stream2' 'Stream'}};\n"},{"name":"Serialize","language":"javascript","atomic":true,"explicit-callback":true,"implementation-file":"semantics/javascript/implementation/atomics/serialize.js","implementation":"for(var i=0; i<{{input 'Array'}}.length; i++){\n  {{output 'Stream'}} = {{input 'Array'}}[i];\n  if(i == {{input 'Array'}}.length -1){\n    {{set-meta 'Stream' 'last' true}};\n  }\n  {{set-meta 'Stream' 'StreamComponent' 'i'}};\n  {{output-data 'Stream'}};\n}\n"},{"name":"Deserialize","language":"javascript","atomic":true,"explicit-callback":true,"implementation-file":"semantics/javascript/implementation/atomics/deserialize.js","implementation":"if(!('Value' in storage)){\n  storage.Value = [];\n}\nstorage.Value.push({{input 'Stream'}});\nif({{has-meta 'Stream' 'last'}} && {{meta-query 'Stream' 'last'}} == true){\n  {{output 'Array'}} = storage.Value;\n  {{output-data 'Array'}};\n  delete storage.Value;\n}\n"},{"name":"SyncFirst","language":"javascript","atomic":true,"explicit-callback":true,"implementation-file":"semantics/javascript/implementation/atomics/sync-first.js","implementation":"if({{has-meta 'SyncStream' 'StreamComponent'}} && {{meta-query 'SyncStream' 'StreamComponent'}} == 0){\n  {{merge-meta 'Sync' 'SyncValue'}};\n  {{output 'Sync'}} = {{input 'SyncValue'}};\n  {{output-data 'Sync'}};\n}\n"},{"name":"Last","language":"javascript","atomic":true,"implementation-file":"semantics/javascript/implementation/atomics/last.js","implementation":"var arr = {{input 'Stream'}};\n{{output 'Last'}} = arr[arr.length - 1];\n"},{"name":"CSPLoopControl","language":"javascript","atomic":true,"explicit-input":true,"explicit-callback":true,"implementation-file":"semantics/javascript/implementation/atomics/csp-loop-control.js","implementation":"if(!(\"initial\" in storage)){\n  {{input-data 'Initial'}}\n  {{output 'OutStream'}} = {{input 'Initial'}};\n  {{merge-meta 'OutStream' 'Initial'}};\n  storage.initial = true;\n  {{output-data 'OutStream'}};\n}\nelse {\n  {{input-data 'Stream'}}\n  if(({{has-meta 'Stream' 'last'}}) && {{meta-query 'Stream' 'last'}} == true){\n    delete storage.initial\n    continue;\n  }\n  {{output 'OutStream'}} = {{input 'Stream'}};\n  {{merge-meta 'OutStream' 'Stream'}};\n  {{output-data 'OutStream'}};\n}\n"}],"construction":[{"name":"js-csp","language":"javascript","description":"uses CSP to build construct a javascript program with channel communication between groups","templates":[{"template":"requires","file":"semantics/javascript/templates/csp/requires.js","process":"implementations","template-file":""},{"template":"header","file":"semantics/javascript/templates/csp/header.js","process":"once","template-file":"var csp = require(\"js-csp\");\nvar merge = require(\"object-merge\");\n\nfunction* id(input, out){\n  while(true)\n  {\n    var taken = yield csp.take(input);\n    yield csp.put(out, taken);\n  }\n}\n"},{"template":"atomics","file":"semantics/javascript/templates/csp/atomics.js","process":"implementations","template-file":"{{#if implementation.implementation}}\nvar {{implementation.name}}_{{node.id}} = function(){\n  var storage = {};\n  return function*(InQueues, OutQueues, name, meta){\n{{~#unless implementation.input}}\n  while(true){\n{{~/unless}}\n    var output = {};\n{{~#each symbol.connectors}}{{#if_eq type \"Output\"}}\n    output['{{name}}'] = { meta: {} };\n{{~/if_eq}}{{#if_eq type \"Generator\"}}\n    output['{{name}}'] = { meta: {} };\n{{~/if_eq}}{{/each}}\n    var input = {};\n{{~#unless implementation.explicit-input}}\n{{~#each symbol.connectors}}{{#if_eq type \"Input\"}}\n    input[\"{{name}}\"] = yield csp.take(InQueues[name + \":{{name}}\"]);\n{{~#if ../../debug}}\n    console.log(\"logging after taking {{../../../generic.name}}->{{name}} \");\n    console.log(input[\"{{name}}\"]);\n{{~/if}}\n{{~/if_eq}}{{/each}}{{/unless}}\n    {{implementation.implementation}}\n{{~#unless implementation.explicit-callback}}\n    {{#each symbol.connectors}}{{#if_eq type \"Output\"}}\n{{~#if ../../debug}}\n        console.log(\"putting after {{../../../generic.name}}->{{name}}\");\n        console.log(output[\"{{name}}\"]);\n{{~/if}}\n    yield csp.put(OutQueues[name + \":{{name}}\"], output[\"{{name}}\"]);\n{{~#if ../../debug}}\n  console.log(\"put done\");\n{{~/if}}{{/if_eq}}{{#if_eq type \"Generator\"}}\n{{~#if ../../debug}}\n        console.log(\"putting after {{../../../generic.name}}->{{name}}\");\n        console.log(output[\"{{name}}\"]);\n{{~/if}}\n    yield csp.put(OutQueues[name + \":{{name}}\"], output[\"{{name}}\"]);\n{{~#if ../../debug}}\n  console.log(\"put done\");\n{{~/if}}\n    {{/if_eq}}{{/each}}\n{{~/unless}}\n  }\n{{~#unless implementation.input}}\n}\n{{~/unless}}\n}();\n{{~/if}}\n"},{"template":"graph","file":"semantics/javascript/templates/csp/graph.js","process":"graph","template-file":"function Connection_Graph(){\n  var qOutput = {\n{{~#each connections}}\n    \"{{from.generic}}__{{from.mangle}}:{{from.connector}}\" : csp.chan(),\n{{~/each}}\n  };\n  var qInput = {\n{{~#each connections}}\n    \"{{to.generic}}__{{to.mangle}}:{{to.connector}}\" : qOutput[\"{{from.generic}}__{{from.mangle}}:{{from.connector}}\"],\n{{~/each}}\n  };\n\n{{#each nodes}}\n  Node_{{id}}(qInput, qOutput, {{node-meta-to-string meta}});\n{{~/each}}\n}\n"},{"template":"nodes","file":"semantics/javascript/templates/csp/nodes.js","process":"nodes","template-file":"function Node_{{node.id}} (InQueues, OutQueues, meta){\n{{#if implementation.atomic}}\n  var name = \"{{node.id}}__{{node.mangle}}\";\n  csp.go({{implementation.name}}_{{node.id}},[InQueues, OutQueues, name, meta]);\n{{/if}}\n}\n"},{"template":"footer","file":"semantics/javascript/templates/csp/footer.js","process":"once","template-file":"Connection_Graph();\n"}],"postprocessing":[{"name":"multiple-outputs","process":"outputs","procedure-file":"semantics/javascript/processing/multiple-outputs.ls","procedure":"/* This file is part of Buggy.\n\n Buggy is free software: you can redistribute it and/or modify\n it under the terms of the GNU General Public License as published by\n the Free Software Foundation, either version 3 of the License, or\n (at your option) any later version.\n\n Buggy is distributed in the hope that it will be useful,\n but WITHOUT ANY WARRANTY; without even the implied warranty of\n MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n GNU General Public License for more details.\n\n You should have received a copy of the GNU General Public License\n along with Buggy.  If not, see <http://www.gnu.org/licenses/>.\n */\n\n#######  CSP Multiple Outputs\n###  CSP can only have one distinct output for every node\n###  this method creates nodes that clone each stream if a Connector\n###  is connector to more than one other node\n\n# creates a uniqe name for the output connector of a node\nc-name = (c) ->\n  cname = c.from.generic + \"__\" + c.from.mangle + \"__\" + c.from.connector\n  if c.type == \"Inverse\"\n    cname = cname + \"_INV\"\n  return cname\n\n# creates a unique new name for the clone node\nclone-name = (name) ->\n  \"Clone__\" + name\n\nnode-connectors-with-multiple-outputs = (graph) ->\n  # group nodes by their output connector\n  node-outs = (graph.connections |> group-by (c) -> c-name c)\n  # filter all with only one output those are okay for csp\n  node-outs |> Obj.filter -> it.length > 1\n\nreturn (graph) ->\n\n  mult-nodes = node-connectors-with-multiple-outputs graph\n\n  # create clone nodes\n  new-nodes = (values mult-nodes) |> map ->\n    {\n      name: \"Clone\" + it.length  # length encoding is resolved in later postprocessing steps\n      id: clone-name it.0.from.generic\n      parent-group: it.0.parent-group\n    }\n\n  old-connections = graph.connections |> filter (c) ->\n    cname = c-name c\n    not (cname of mult-nodes)\n\n  new-connections = (values mult-nodes) |> map (c-list) ->\n    c-stream = 0\n    cn = clone-name c-list.0.from.generic\n    connections = c-list |> map (c) ->\n      c-stream := c-stream + 1\n      {\n        from: {\n          generic: cn\n          connector: \"Stream#c-stream\"\n        }\n        to: c.to\n        type: \"Normal\"\n        parent-group: c.parent-group\n      }\n    union connections, [{\n      from: c-list.0.from\n      to: {\n        generic: cn\n        connector: \"Stream\"\n      }\n      type: \"Normal\"\n      parent-group: c-list.0.parent-group\n    }]\n\n\n  new-graph = {\n    nodes: union graph.nodes, new-nodes\n    connections: union old-connections, (flatten new-connections)\n  }\n  return new-graph\n"},{"name":"multi-clone","process":"outputs","procedure-file":"semantics/javascript/processing/multi-clone.ls","dependencies":["multiple-outputs"],"procedure":"/* This file is part of Buggy.\n\n Buggy is free software: you can redistribute it and/or modify\n it under the terms of the GNU General Public License as published by\n the Free Software Foundation, either version 3 of the License, or\n (at your option) any later version.\n\n Buggy is distributed in the hope that it will be useful,\n but WITHOUT ANY WARRANTY; without even the implied warranty of\n MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n GNU General Public License for more details.\n\n You should have received a copy of the GNU General Public License\n along with Buggy.  If not, see <http://www.gnu.org/licenses/>.\n */\n\n#######  CSP Multi Clone\n###  To emulate arbitrary output connections streams are cloned\n###  An arbitrary number of outgoing connectors is required but not\n###  possible so we have to emulate this behaviour by manipulating the graph.\n\nreturn (graph) ->\n  graph.nodes = graph.nodes |> map (n) ->\n    if (take 5, n.name) == \"Clone\"\n      if (drop 5, n.name) == \"2\"\n        {\n          name: \"Clone\",\n          id: n.id\n          parent-group: n.parent-group\n        }\n      else\n        throw new Error \"Clone with more than 2 outputs not supported yet\"\n    else\n      n\n\n  graph\n"},{"name":"loops","process":"outputs","procedure-file":"semantics/javascript/processing/loops.ls","procedure":"/* This file is part of Buggy.\n\n Buggy is free software: you can redistribute it and/or modify\n it under the terms of the GNU General Public License as published by\n the Free Software Foundation, either version 3 of the License, or\n (at your option) any later version.\n\n Buggy is distributed in the hope that it will be useful,\n but WITHOUT ANY WARRANTY; without even the implied warranty of\n MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the\n GNU General Public License for more details.\n\n You should have received a copy of the GNU General Public License\n along with Buggy.  If not, see <http://www.gnu.org/licenses/>.\n */\n\n#######  Loops\n###  This post processing module finds loops and adds groups that\n###  stop looping after the last element.\n\n\n# unique representation of an node\nid = (v) ->\n  v.generic\n\n# gets the outgoing edges of an vertex\nout-edges = (graph, v) ->\n  graph.connections |> filter -> (id it.from) == v\n\n# find loops in a graph and returns an array of every loop\nloops = (graph) ->\n  # use DFS to find loops\n  pred = {}\n  finished = {}\n  loop-list = []\n\n  dfs-recursive = (u, v) ->\n    cnid = (id v)  + \":\" + v.connector\n    pred[cnid] = [{generic: (id u), connector: u.connector, to: (id v), to-conn: v.connector}]\n\n    (out-edges graph, id v) |> map (c) ->\n      ccnid = (id c.to) + \":\" + c.to.connector\n      if not (ccnid of pred)\n        dfs-recursive c.from, c.to\n      else if not (ccnid of finished)\n        pred[ccnid].push generic: (id v), connector: c.from.connector, to: (id c.to), to-conn: c.to.connector\n        loop-list.push { generic: (id v), connector: v.connector, from: u.generic, from-conn: u.connector }\n\n    finished[cnid] = true\n\n  graph.nodes |> map (v) ->\n    (out-edges graph, v.id) |> map (c) ->\n      ccnid = (id c.to) + \":\" + c.to.connector\n      if (not (ccnid of pred))\n        dfs-recursive c.from , c.to\n\n  double-connection = (values pred) |> filter (c) ->\n    c.length == 2\n\n  generic-id = (dc) ->\n    conn_id = join \"_\", (words dc.0.to-conn)\n    dc.0.to + \"__\" + conn_id + \"CSPLoopControl\"\n\n  new-nodes = (double-connection) |> map (dc) ->\n    {\n      name: \"CSPLoopControl\",\n      id: generic-id dc,\n    }\n\n  connections = graph.connections |> filter (c) ->\n    not (double-connection |> any (dc) ->\n      dc.0.to == c.to.generic and dc.0.to-conn == c.to.connector)\n\n  new-connections = double-connection |> map (dc) ->\n    [\n      {\n        from: { generic: (generic-id dc), connector: \"OutStream\" }\n        to: {  generic: dc.0.to,  connector: dc.0.to-conn }\n        type: \"Normal\"\n      }\n      {\n        from: { generic: dc.0.generic, connector: dc.0.connector }\n        to: {  generic: (generic-id dc), connector: \"Initial\" }\n        type: \"Normal\"\n      }\n      {\n        from: { generic: dc.1.generic, connector: dc.1.connector }\n        to: { generic: (generic-id dc), connector: \"Stream\" }\n        type: \"Normal\"\n      }\n    ]\n\n  {\n    nodes: union graph.nodes, new-nodes\n    connections: union connections, (flatten new-connections)\n  }\n\nreturn (graph) ->\n  loops graph\n"}]}]};
