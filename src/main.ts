import { createEditor } from "./editor"
import { iEngine } from "./engine/iEngine";
import "./style.css"
import  "./script.ts"

// todo insert node, magnetic connection, selectable connections


const editor = await createEditor(document.getElementById("app")!);

const list = editor.getModules();
editor.openModule(list[0]);
(window as any).editor = editor;

let modules: { [k: string]: string } = {};
for (let i = 0; i < list.length; i++) {
    const str = editor.getModuleString(list[i]);
    modules[list[i]] = str;

}
const e = iEngine(modules);
e.init(editor.getModuleString(list[0]));
(window as any).e = e;