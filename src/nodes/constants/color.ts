import { ClassicPreset as Classic } from 'rete'
import { socketColor } from '../../sockets'

export class ColorNode
    extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }>
{
    width = 180;
    height = 140;
    nodeTitle = { ru: "Цвет", type: "yellow" }

    constructor(initial: string) {
        super("Color");

        this.addOutput("out", new Classic.Output(socketColor, "Цвет"))
        this.addControl("val", new Classic.InputControl("color" as any, { initial }));
    }

    serialize() {
        return {
            val: (this.controls as any).val.value
        };
    }
}
