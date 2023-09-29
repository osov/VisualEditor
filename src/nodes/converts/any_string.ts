import { ClassicPreset as Classic } from 'rete'
import { socketAny, socketString } from '../../sockets'
import { TitleNodeControl } from "../../controls"


export class AnyToStringNode extends Classic.Node {
    width = 180;
    height = 120;
    constructor() {
        super("AnyToString");

        this.addControl("TitleNode", new TitleNodeControl("В строку"))
        this.addInput("in", new Classic.Input(socketAny, "данные"));
        this.addOutput("out", new Classic.Output(socketString, "Строка"));
    }

    serialize() {
        return {}
    }
}
