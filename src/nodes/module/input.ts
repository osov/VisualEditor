import { ClassicPreset as Classic, GetSchemes, NodeEditor } from 'rete'
import { socket } from '../../sockets'


export class InputNode
    extends Classic.Node<
        {},
        { value: Classic.Socket },
        { key: Classic.InputControl<"text"> }
    >
{
    width = 180;
    height = 140;
    value: any = null;

    constructor(initial: string) {
        super("Input");

        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addOutput("value", new Classic.Output(socket, "Number"));
    }

    data() {
        return {
            value: this.value
        };
    }

    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
