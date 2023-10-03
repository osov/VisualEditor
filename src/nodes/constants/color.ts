import { ClassicPreset as Classic } from 'rete'
// import { socketString } from '../../sockets'
import { socketColor } from '../../sockets'

export class ColorNode
    extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }, { val: Classic.InputControl<"color"> }>
{
    width = 180;
    height = 140;
    nodeTitle: { ru: string, type: string }

    constructor(initial: string) {
        super("String");
        this.nodeTitle = {ru: "Цвет", type: "yellow"}

        this.addOutput("out", new Classic.Output(socketColor, "Цвет"))
        this.addControl("val", new Classic.InputControl("color", { initial }));
    }

    serialize() {
        return {
            val: this.controls.val.value
        };
    }
}
