import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'
import { TitleNodeControl } from "../../controls"

export class OutputActionNode
    extends Classic.Node<{ m: Classic.Socket }, {}, { TitleNode: TitleNodeControl, key: Classic.InputControl<"text"> }>
{
    width = 180;
    height = 140;

    constructor(initial: string) {
        super("OutputAction");

        this.addControl("TitleNode", new TitleNodeControl("Выход действие"))
        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addInput("m", new Classic.Input(socketAction, ""));
    }

    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
