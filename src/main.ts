import { register_lua_types } from "./engine/lua_types.ts";
import { createEditor } from "./editor"
import { iEngine } from "./engine/iEngine";
import "./style.css"
import "./script.ts"
import { load_data_manager } from "./engine/data_manager.ts";
import { init_debug } from "./debug.ts";

// todo insert node, magnetic connection, selectable connections

await load_data_manager();
init_debug();

const editor = await createEditor(document.getElementById("app")!);

editor.loadModules(dataManager.get_modules())
editor.openModule('global');

register_lua_types();
(window as any).editor = editor;
(window as any).e = iEngine();