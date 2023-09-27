import { ClassicPreset as Classic } from 'rete'
import { socketString } from '../../sockets'
import { TitleNodeControl } from "../../controls"

export class StringNode
    extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }, { TitleNode: TitleNodeControl, val: Classic.InputControl<"text"> }>
{
    width = 180;
    height = 140;

    constructor(initial: string) {
        super("String");

        this.addControl("TitleNode", new TitleNodeControl("Строка", 'yellow'))
        this.addOutput("out", new Classic.Output(socketString, "Строка"))
        this.addControl("val", new Classic.InputControl("text", { initial }));
    }

    serialize() {
        return {
            val: this.controls.val.value
        };
    }
}
