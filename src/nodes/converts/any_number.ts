import { ClassicPreset as Classic } from 'rete'
import { socketAny, socketNumber } from '../../sockets'


export class AnyToNumberNode extends Classic.Node {
    width = 180;
    height = 120;
    nodeTitle = { ru: "В число", type: "green" }

    constructor() {
        super("AnyToNumber");

        this.addInput("in", new Classic.Input(socketAny, "данные"));
        this.addOutput("out", new Classic.Output(socketNumber, "Число"));
    }

    serialize() {
        return {}
    }
}
