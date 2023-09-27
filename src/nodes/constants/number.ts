import { ClassicPreset as Classic } from 'rete'
import { socketNumber } from '../../sockets'
import { TitleNodeControl } from "../../controls"

export class NumberNode
    extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }, { TitleNode: TitleNodeControl, val: Classic.InputControl<"number"> }>
{
    width = 180;
    height = 140;

    constructor(initial: number) {
        super("Number");

        this.addControl("TitleNode", new TitleNodeControl("Число", 'yellow'))
        this.addOutput("out", new Classic.Output(socketNumber, "Число"))
        this.addControl("val", new Classic.InputControl("number", { initial }));
    }

    serialize() {
        return {
            val: this.controls.val.value
        };
    }
}
