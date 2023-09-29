import { createEditor } from "./editor"
import { iEngine } from "./engine/iEngine";
import "./style.css"
import "./script.ts"

// todo insert node, magnetic connection, selectable connections


const editor = await createEditor(document.getElementById("app")!);

const tmp_modules = '{"global":{"nodes":[{"id":"n0","name":"Module","x":468,"y":-120,"data":{"name":"double"}},{"id":"n1","name":"Number","x":-57,"y":-269,"data":{"val":5}},{"id":"n2","name":"Log","x":1121,"y":-274,"data":{"val":""}},{"id":"n3","name":"EngineReady","x":9,"y":-572,"data":{}},{"id":"n4","name":"Sequence","x":406,"y":-647,"data":{"val":2}},{"id":"n5","name":"Log","x":1074,"y":-591,"data":{"val":"123"}},{"id":"n6","name":"EngineReady","x":-129,"y":-58,"data":{}},{"id":"n7","name":"Log","x":912,"y":-40,"data":{"val":"выход"}},{"id":"n8","name":"AnyToNumber","x":215,"y":-214,"data":{}},{"id":"1423f346e257b1b0","name":"Delay","x":805,"y":-657,"data":{"ms":2000}},{"id":"c1206e17003c9b52","name":"Delay","x":867,"y":-431,"data":{"ms":3000}}],"connections":[{"source":"n0","sourceOutput":"x2","target":"n2","targetInput":"data"},{"source":"n3","sourceOutput":"out","target":"n4","targetInput":"in"},{"source":"n6","sourceOutput":"out","target":"n0","targetInput":"данные2"},{"source":"n1","sourceOutput":"out","target":"n8","targetInput":"in"},{"source":"n8","sourceOutput":"out","target":"n0","targetInput":"число"},{"source":"n4","sourceOutput":"out1","target":"1423f346e257b1b0","targetInput":"in"},{"source":"1423f346e257b1b0","sourceOutput":"out","target":"n5","targetInput":"in"},{"source":"n4","sourceOutput":"out2","target":"c1206e17003c9b52","targetInput":"in"},{"source":"c1206e17003c9b52","sourceOutput":"out","target":"n2","targetInput":"in"},{"source":"n0","sourceOutput":"выход1","target":"n7","targetInput":"in"}],"comments":[]},"transit":{"nodes":[{"id":"n0","name":"Input","x":12,"y":67,"data":{"key":"v1"}},{"id":"n1","name":"Output","x":322,"y":12,"data":{"key":"o1"}}],"connections":[{"source":"n0","sourceOutput":"m","target":"n1","targetInput":"m"}],"comments":[{"text":"Transit","links":["n0","n1"]}]},"double":{"nodes":[{"id":"n0","name":"Input","x":-78,"y":-53,"data":{"key":"число"}},{"id":"n1","name":"Output","x":643,"y":-84,"data":{"key":"x2"}},{"id":"n2","name":"Add","x":259,"y":-92,"data":{"A":1,"B":2}},{"id":"n3","name":"InputAction","x":-22,"y":139,"data":{"key":"данные2"}},{"id":"n4","name":"Sequence","x":261,"y":165,"data":{"val":2}},{"id":"n5","name":"Log","x":628,"y":130,"data":{"val":"данные1"}},{"id":"n6","name":"OutputAction","x":638,"y":309,"data":{"key":"выход1"}}],"connections":[{"source":"n0","sourceOutput":"m","target":"n2","targetInput":"A"},{"source":"n0","sourceOutput":"m","target":"n2","targetInput":"B"},{"source":"n2","sourceOutput":"sum","target":"n1","targetInput":"m"},{"source":"n3","sourceOutput":"m","target":"n4","targetInput":"in"},{"source":"n4","sourceOutput":"out1","target":"n5","targetInput":"in"},{"source":"n4","sourceOutput":"out2","target":"n6","targetInput":"m"}],"comments":[]}}';
let data = localStorage['data']
if (!data)
    data = tmp_modules
editor.loadModules(data)
editor.openModule('global');

(window as any).editor = editor;
(window as any).e = iEngine();