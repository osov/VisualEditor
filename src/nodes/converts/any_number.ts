import { ClassicPreset as Classic } from 'rete'
import { socketAny, socketNumber } from '../../sockets'
import { TitleNodeControl } from "../../controls"


export class AnyToNumberNode extends Classic.Node {
    width = 180;
    height = 120;
    constructor() {
        super("AnyToNumber");

        this.addControl("TitleNode", new TitleNodeControl("В число"))
        this.addInput("in", new Classic.Input(socketAny, "данные"));
        this.addOutput("out", new Classic.Output(socketNumber, "Число"));
    }

    serialize() {
        return {}
    }
}
