import { ClassicPreset as Classic } from "rete"
import { socketAction } from "../../sockets"

export class InActionNode extends Classic.Node {
    width = 190
    height = 70
    nodeTitle = { ru: "", type: "green" };

    constructor(node_name: string, node_title: string) {
        super(node_name);
        this.nodeTitle.ru = node_title;
        this.addInput("in", new Classic.Input(socketAction, "", true));
    }

    serialize() {
        return {
        }
    }
}
