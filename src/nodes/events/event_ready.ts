import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'

export class EventReadyNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }>
{
    width = 180;
    height = 70;
    nodeTitle = { ru: "", type: "red" }

    constructor(node_name: string, node_title: string) {
        super(node_name);
        this.nodeTitle.ru = node_title;

        this.addOutput("out", new Classic.Output(socketAction, ""));
    }

    serialize() {
        return {};
    }
}
