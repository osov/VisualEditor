import { ClassicPreset as Classic } from 'rete'
import { socketAny } from '../../sockets'


export class InputNode
    extends Classic.Node<
        {},
        { val: Classic.Socket },
        { key: Classic.InputControl<"text"> }
    >
{
    width = 180;
    height = 140;

    constructor(initial: string) {
        super("Input");

        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addOutput("val", new Classic.Output(socketAny, "Любой"));
    }


    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
