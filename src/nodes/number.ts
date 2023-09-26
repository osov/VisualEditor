import { ClassicPreset as Classic } from 'rete'
import { socketNumber } from '../sockets'
import { TitleNodeControl } from "../controls"

export class NumberNode
    extends Classic.Node<
        { _: Classic.Socket },
        { out: Classic.Socket },
        { val: Classic.InputControl<"number"> }
    >
{
    width = 180;
    height = 140;
    constructor(initial: number, change?: (val: number) => void) {
        super("Number");

        this.addControl("TitleNode", new TitleNodeControl("Число"))
        this.addOutput("out", new Classic.Output(socketNumber, "Число"));
        this.addControl("val", new Classic.InputControl("number", { initial, change })
        );
    }

    serialize() {
        return {
            val: this.controls.val.value
        };
    }
}
