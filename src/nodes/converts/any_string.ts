import { ClassicPreset as Classic } from 'rete'
import { socketAny, socketString } from '../../sockets'


export class AnyToStringNode extends Classic.Node {
    width = 180;
    height = 110;
    nodeTitle = { ru: "В строку", type: "green" }

    constructor() {
        super("AnyToString");

        this.addInput("in", new Classic.Input(socketAny, "данные"));
        this.addOutput("out", new Classic.Output(socketString, "Строка"));
    }

    serialize() {
        return {}
    }
}
