import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'

export class OutputActionNode
    extends Classic.Node<{ m: Classic.Socket }, {}, { key: Classic.InputControl<"text"> }>
{
    width = 180;
    height = 140;
    nodeTitle: { ru: string, type: string }

    constructor(initial: string) {
        super("OutputAction");
        this.nodeTitle = { ru: "Выход действие", type: "green" }

        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addInput("m", new Classic.Input(socketAction, ""));
    }

    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
