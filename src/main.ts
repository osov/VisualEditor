import { createEditor } from "./editor"
import { iEngine } from "./engine/iEngine";
import "./style.css"

// todo insert node, magnetic connection, selectable connections


const editor = await createEditor(document.getElementById("app")!);

const list = editor.getModules();
editor.openModule(list[0]);
(window as any).editor = editor;

const e = iEngine();
e.init(editor.getModuleString(list[0]));
(window as any).e = e;