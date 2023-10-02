import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'

export class OutputActionNode
    extends Classic.Node<{ m: Classic.Socket }, {}, { key: Classic.InputControl<"text"> }>
{
    width = 180;
    height = 140;

    constructor(initial: string) {
        super("OutputAction");
        this.nodeTitle = {ru: "Выход действие", type: "green"}

        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addInput("m", new Classic.Input(socketAction, "Любой"));
    }

    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
