import { register_lua_types } from "./engine/lua_types.ts";
import { createEditor } from "./editor"
import { iEngine } from "./engine/iEngine";
import "./style.css"
import "./script.ts"

// todo insert node, magnetic connection, selectable connections


const editor = await createEditor(document.getElementById("app")!);

const tmp_modules = '{"global":{"nodes":[{"id":"n0","name":"Module","x":696,"y":467,"data":{"name":"double"}},{"id":"n1","name":"Number","x":12,"y":597,"data":{"val":5}},{"id":"n2","name":"Log","x":1013,"y":222,"data":{"val":""}},{"id":"n3","name":"EngineReady","x":12,"y":287,"data":{}},{"id":"n4","name":"Sequence","x":322,"y":160,"data":{"val":2}},{"id":"n5","name":"Log","x":1013,"y":12,"data":{"val":"123"}},{"id":"n6","name":"EngineReady","x":382,"y":732,"data":{}},{"id":"n7","name":"Log","x":1013,"y":482,"data":{"val":"выход"}},{"id":"n8","name":"AnyToNumber","x":352,"y":562,"data":{}},{"id":"n9","name":"Delay","x":696,"y":32,"data":{"ms":2000}},{"id":"n10","name":"Delay","x":696,"y":242,"data":{"ms":3000}}],"connections":[{"source":"n0","sourceOutput":"x2","target":"n2","targetInput":"data"},{"source":"n3","sourceOutput":"out","target":"n4","targetInput":"in"},{"source":"n6","sourceOutput":"out","target":"n0","targetInput":"данные2"},{"source":"n1","sourceOutput":"out","target":"n8","targetInput":"in"},{"source":"n8","sourceOutput":"out","target":"n0","targetInput":"число"},{"source":"n4","sourceOutput":"out1","target":"n9","targetInput":"in"},{"source":"n9","sourceOutput":"out","target":"n5","targetInput":"in"},{"source":"n4","sourceOutput":"out2","target":"n10","targetInput":"in"},{"source":"n10","sourceOutput":"out","target":"n2","targetInput":"in"},{"source":"n0","sourceOutput":"выход1","target":"n7","targetInput":"in"}],"comments":[]},"transit":{"nodes":[{"id":"n0","name":"Input","x":12,"y":67,"data":{"key":"v1"}},{"id":"n1","name":"Output","x":322,"y":12,"data":{"key":"o1"}}],"connections":[{"source":"n0","sourceOutput":"m","target":"n1","targetInput":"m"}],"comments":[{"text":"Transit","links":["n0","n1"]}]},"double":{"nodes":[{"id":"n0","name":"Input","x":12,"y":155,"data":{"key":"число"}},{"id":"n1","name":"Output","x":698,"y":12,"data":{"key":"x2"}},{"id":"n2","name":"Add","x":343,"y":67,"data":{"A":0,"B":0}},{"id":"n3","name":"InputAction","x":12,"y":525,"data":{"key":"данные2"}},{"id":"n4","name":"Sequence","x":323,"y":398,"data":{"val":2}},{"id":"n5","name":"Log","x":698,"y":245,"data":{"val":"данные1"}},{"id":"n6","name":"OutputAction","x":1008,"y":380,"data":{"key":"выход1"}},{"id":"n7","name":"Module","x":698,"y":435,"data":{"name":"trasit_code"}}],"connections":[{"source":"n0","sourceOutput":"m","target":"n2","targetInput":"A"},{"source":"n0","sourceOutput":"m","target":"n2","targetInput":"B"},{"source":"n2","sourceOutput":"sum","target":"n1","targetInput":"m"},{"source":"n3","sourceOutput":"m","target":"n4","targetInput":"in"},{"source":"n4","sourceOutput":"out1","target":"n5","targetInput":"in"},{"source":"n4","sourceOutput":"out2","target":"n7","targetInput":"key"},{"source":"n7","sourceOutput":"key","target":"n6","targetInput":"m"}],"comments":[]},"trasit_code":{"nodes":[{"id":"n0","name":"InputAction","x":12,"y":254,"data":{"key":"key"}},{"id":"n1","name":"OutputAction","x":994,"y":87,"data":{"key":"key"}},{"id":"n2","name":"Sequence","x":322,"y":127,"data":{"val":2}},{"id":"n3","name":"Log","x":696,"y":12,"data":{"val":"trasit"}},{"id":"n4","name":"Module","x":776,"y":230,"data":{"name":"trans2"}}],"connections":[{"source":"n0","sourceOutput":"m","target":"n2","targetInput":"in"},{"source":"n2","sourceOutput":"out1","target":"n3","targetInput":"in"},{"source":"n2","sourceOutput":"out2","target":"n4","targetInput":"key"},{"source":"n4","sourceOutput":"key","target":"n1","targetInput":"m"}],"comments":[]},"trans2":{"nodes":[{"id":"n0","name":"InputAction","x":-245,"y":-14,"data":{"key":"key"}},{"id":"n1","name":"OutputAction","x":169,"y":1,"data":{"key":"key"}},{"id":"n2","name":"Sequence","x":-44,"y":-324,"data":{"val":2}},{"id":"n3","name":"Log","x":372,"y":-291,"data":{"val":"trasitka"}}],"connections":[{"source":"n0","sourceOutput":"m","target":"n2","targetInput":"in"},{"source":"n2","sourceOutput":"out2","target":"n1","targetInput":"m"},{"source":"n2","sourceOutput":"out1","target":"n3","targetInput":"in"}],"comments":[]}}';
let data = localStorage['data']
if (!data)
    data = tmp_modules
editor.loadModules(data)
editor.openModule('global');

register_lua_types();
(window as any).editor = editor;
(window as any).e = iEngine();