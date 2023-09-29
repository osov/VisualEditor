import { NodeEditor } from "rete"
import { AreaPlugin } from "rete-area-plugin"
import { CommentPlugin } from "rete-comment-plugin"

function getNodeId(editor: NodeEditor<any>) {
    let index = 0
    while (true) {
        const k = 'n' + index
        const node = editor.getNode(k)
        if (!node)
            return k
        index++
    }
}

export function reOrderEditor(editor: NodeEditor<any>, area: AreaPlugin<any>, comment: CommentPlugin<any>) {
    const nodes = editor.getNodes()
    const rNodes: { [k: string]: string } = {}
    for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        if (n.id.length == 16) {
            const tmp = n.id
            n.id = getNodeId(editor)
            rNodes[tmp] = n.id
            area.nodeViews.set(n.id, area.nodeViews.get(tmp)!)
        }
    }

    const connections = editor.getConnections()
    for (let i = 0; i < connections.length; i++) {
        const c = connections[i]
        if (rNodes[c.source])
            c.source = rNodes[c.source]
        if (rNodes[c.target])
            c.target = rNodes[c.target]
    }

    for (const c of comment.comments) {
        const links = c[1].links
        for (let j = 0; j < links.length; j++) {
            const l = links[j]
            if (rNodes[l])
                links[j] = rNodes[l]
        }
    }
}


export function showIds(editor: NodeEditor<any>, area: any) {
    const nodes = editor.getNodes()
    for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        let title: string = n.controls.TitleNode.title;
        title = title.split('[')[0];
        n.controls.TitleNode.title = title + '[' + n.id + ']';
        //area.update('node', n.id);
    }

    for (let k of area.nodeViews) {
        const nid = k[0]
        area.update('node', nid);
    }
}