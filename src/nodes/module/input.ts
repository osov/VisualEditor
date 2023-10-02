import { ClassicPreset as Classic } from 'rete'
import { socketAny } from '../../sockets'

export class InputNode
    extends Classic.Node<{}, { m: Classic.Socket }, { key: Classic.InputControl<"text"> }>
{
    width = 180;
    height = 140;
    nodeTitle: { ru: string, type: string }

    constructor(initial: string) {
        super("Input");
        this.nodeTitle = { ru: "Ввод", type: "green" }

        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addOutput("m", new Classic.Output(socketAny, "Любой"));
    }


    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
