import { ClassicPreset as Classic } from 'rete'
import { socketAny, socketBoolean, socketNumber } from '../../sockets'


export class InvertBoolNode extends Classic.Node {
    width = 180;
    height = 110;
    nodeTitle = { ru: "Отрицание", type: "green" }

    constructor() {
        super("!");

        this.addInput("in", new Classic.Input(socketBoolean, "логическое"));
        this.addOutput("out", new Classic.Output(socketBoolean, "логическое НЕ"));
    }

    serialize() {
        return {}
    }
}
