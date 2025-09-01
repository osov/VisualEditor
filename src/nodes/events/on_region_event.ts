import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'

export class OnRegionEventNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }, {val: Classic.InputControl<"text">}> {
    width = 180;
    height = 100;
    private area = (window as any).area;
    nodeTitle = { ru: "", type: "red" }

    constructor(node_name: string, node_title: string, initial = '') {
        super(node_name);
        this.nodeTitle.ru = node_title;
        this.addControl("val", new Classic.InputControl("text", { initial }));
        this.addOutput("out", new Classic.Output(socketAction, ""))
    }

    serialize() {
        return {
            id: this.controls.val.value
        }
    }
}
