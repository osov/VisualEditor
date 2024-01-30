import { ClassicPreset as Classic } from 'rete'
import { socketAny, socketNumber } from '../../sockets'


export class InvertNumberNode extends Classic.Node {
    width = 180;
    height = 110;
    nodeTitle = { ru: "Сменить знак", type: "green" }

    constructor() {
        super("InvNumber");

        this.addInput("in", new Classic.Input(socketNumber, "число"));
        this.addOutput("out", new Classic.Output(socketNumber, "число"));
    }

    serialize() {
        return {}
    }
}
