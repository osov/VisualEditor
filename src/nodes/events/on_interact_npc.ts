import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'

export class OnInteractNPCNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }, {val: Classic.InputControl<"text">}>
{
    width = 220;
    height = 100;
    private area = (window as any).area;
    nodeTitle = { ru: "Взаимодействие с NPC", type: "red" }

    constructor(initial = '') {
        super("OnInteractNPC");
        this.addControl("val", new Classic.InputControl("text", { initial }));
        this.addOutput("out", new Classic.Output(socketAction, ""))
    }

    serialize() {
        return {
            id: this.controls.val.value
        }
    }
}
