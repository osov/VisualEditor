import { ClassicPreset as Classic } from 'rete'
import { socketString } from '../../sockets'

export class StringNode
    extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }, { val: Classic.InputControl<"text"> }>
{
    width = 180;
    height = 140;

    constructor(initial: string) {
        super("String");
        this.nodeTitle = {ru: "Строка", type: "yellow"}

        this.addOutput("out", new Classic.Output(socketString, "Строка"))
        this.addControl("val", new Classic.InputControl("text", { initial }));
    }

    serialize() {
        return {
            val: this.controls.val.value
        };
    }
}
