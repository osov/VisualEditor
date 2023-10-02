import { ClassicPreset as Classic } from 'rete'
import { socketAny } from '../../sockets'

export class OutputNode
    extends Classic.Node<{ m: Classic.Socket }, {}, { key: Classic.InputControl<"text"> }>
{
    width = 180;
    height = 140;
    nodeTitle: { ru: string, type: string }

    constructor(initial: string) {
        super("Output");
        this.nodeTitle = { ru: "Вывод", type: "green" }

        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addInput("m", new Classic.Input(socketAny, "Любой"));
    }

    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
