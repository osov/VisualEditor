import { ClassicPreset as Classic } from 'rete'
import { socketAny } from '../../sockets'

export class OutputNode
    extends Classic.Node<
        { val: Classic.Socket },
        {},
        { key: Classic.InputControl<"text"> }
    >
{
    width = 180;
    height = 140;

    constructor(initial: string) {
        super("Output");

        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addInput("val", new Classic.Input(socketAny, "Любой"));
    }

    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
