import { ClassicPreset as Classic } from 'rete'
import { socketAny, socketColor, } from '../../sockets'


export class AnyToColorNode extends Classic.Node {
    width = 180;
    height = 110;
    nodeTitle = { ru: "В цвет", type: "green" }

    constructor() {
        super("AnyToColor");

        this.addInput("in", new Classic.Input(socketAny, "данные"));
        this.addOutput("out", new Classic.Output(socketColor, "Строка"));
    }

    serialize() {
        return {}
    }
}
