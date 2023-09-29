import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'
import { TitleNodeControl } from "../../controls"

export class InputActionNode
    extends Classic.Node<{}, { m: Classic.Socket }, { TitleNode: TitleNodeControl, key: Classic.InputControl<"text"> }>
{
    width = 180;
    height = 140;

    constructor(initial: string) {
        super("InputAction");

        this.addControl("TitleNode", new TitleNodeControl("Вход действие"))
        this.addControl("key", new Classic.InputControl("text", { initial }));
        this.addOutput("m", new Classic.Output(socketAction, "Любой"));
    }


    serialize() {
        return {
            key: this.controls.key.value
        };
    }
}
