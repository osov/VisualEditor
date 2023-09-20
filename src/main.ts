import comment from "ant-design-vue/es/comment";
import { createEditor } from "./editor"
import { NumberNode, AddNode, Connection } from "./nodes";
import "./style.css"

// todo insert node, magnetic connection, selectable connections


const editor = await createEditor(document.getElementById("app")!);

const list = editor.getModules();
editor.openModule(list[0]);
(window as any).editor = editor;
//window.openModule = editor.openModule;
// ------------------------------------
/*
    const a = new NumberNode(1)
    const b = new NumberNode(1)
    const add = new AddNode()

    await editor.addNode(a)
    await editor.addNode(b)
    await editor.addNode(add)

    await editor.addConnection(new Connection(a, 'value', add, 'a'))
    await editor.addConnection(new Connection(b, 'value', add, 'b'))

    comment.addFrame("Тут переменные", [a.id, b.id]);
    // ------------------------------
    */