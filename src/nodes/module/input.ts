import { ClassicPreset as Classic } from 'rete'
import { socketAny } from '../../sockets'


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
        this.addOutput("value", new Classic.Output(socketAny, "Any"));
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
