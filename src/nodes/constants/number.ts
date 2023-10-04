import { ClassicPreset as Classic } from 'rete'
import { socketNumber } from '../../sockets'

export class NumberNode
    extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }, { val: Classic.InputControl<"number"> }>
{
    width = 180;
    height = 140;
    nodeTitle = { ru: "Число", type: "yellow" }

    constructor(initial: number) {
        super("Number");


        this.addOutput("out", new Classic.Output(socketNumber, "Число"))
        this.addControl("val", new Classic.InputControl("number", { initial }));
    }

    serialize() {
        return {
            val: this.controls.val.value
        };
    }
}
