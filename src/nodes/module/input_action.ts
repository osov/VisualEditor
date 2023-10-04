import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'

export class InputActionNode
    extends Classic.Node<{}, { m: Classic.Socket }, { key: Classic.InputControl<"text"> }>
{
    width = 180;
    height = 140;
    nodeTitle = { ru: "Вход действие", type: "green" }

    constructor(initial: string) {
        super("InputAction");

        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addOutput("m", new Classic.Output(socketAction, ""));
    }


    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
