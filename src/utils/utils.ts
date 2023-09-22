import { BaseSchemes, NodeEditor, NodeId } from "rete";
import { CommentPlugin } from "rete-comment-plugin";
import { HistoryAction } from "rete-history-plugin";

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