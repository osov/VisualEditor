import { BaseSchemes, ClassicPreset, GetSchemes, NodeEditor, NodeId } from "rete";
import { CommentPlugin } from "rete-comment-plugin";
import { HistoryAction } from "rete-history-plugin";
import { Nodes, Conn } from "../nodes";


export function delay(ms: number) { return new Promise(resolve => setTimeout(resolve, ms)); }

export async function removeConnections(
    editor: NodeEditor<BaseSchemes>,
    nodeId: NodeId
) {
    for (const c of [...editor.getConnections()]) {
        if (c.source === nodeId || c.target === nodeId) {
            await editor.removeConnection(c.id);
        }
    }
}

export async function clearEditor(editor: NodeEditor<BaseSchemes>) {
    for (const c of [...editor.getConnections()]) {
        await editor.removeConnection(c.id);
    }
    for (const n of [...editor.getNodes()]) {
        await editor.removeNode(n.id);
    }
}


export class CommentDeleteAction implements HistoryAction {
    private _comment: CommentPlugin<any> | undefined;
    private _id = '';
    private _text = '';
    private _links: string[] = [];

    constructor(comment: any, id: string, text: string, links: string[]) {
        this._comment = comment;
        this._text = text;
        this._id = id;
        this._links = links;
    }
    undo(): void | Promise<void> {
        this._comment?.addFrame(this._text, this._links);
        for (const c of this._comment!.comments) {
            this._id = c[1].id;
        }
    }
    redo(): void | Promise<void> {
        this._comment?.delete(this._id);
    }
}

type Schemes = GetSchemes<Nodes, Conn>
export function getConnectionSockets(editor: NodeEditor<Schemes>, connection: Schemes["Connection"]) {
    const source = editor.getNode(connection.source);
    const target = editor.getNode(connection.target);

    const output =
        source &&
        (source.outputs as Record<string, any>)[connection.sourceOutput];
    const input =
        target && (target.inputs as Record<string, any>)[connection.targetInput];

    return {
        source: output?.socket,
        target: input?.socket
    };
}

export function isCompatibleSockets(s1: ClassicPreset.Socket, s2: ClassicPreset.Socket) {
    if (s1.name == s2.name)
        return true;
    // В any можно подключить любой кроме действия
    if (s2.name == 'any' && s1.name != 'action')
        return true;
    return false;
}


export function arrayToSelectList(list: string[]) {
    const tmp: { val: string, text: string }[] = [];
    for (let i = 0; i < list.length; i++) {
        const text = list[i];
        tmp.push({ val: i + '', text })
    }
    return tmp;
}