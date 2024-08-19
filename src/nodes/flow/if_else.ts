import { ClassicPreset as Classic } from 'rete'

import { socketAction, socketBoolean } from '../../sockets';


export class IfElseNode extends Classic.Node {
    width = 180;
    height = 180;
    nodeTitle = { ru: "Условный выбор", type: "green" }

    constructor() {
        super("IfElse");
        this.addInput("in", new Classic.Input(socketAction, ""));
        this.addOutput("out_t", new Classic.Output(socketAction, "Истина"));
        this.addOutput("out_f", new Classic.Output(socketAction, "Ложь"));
        this.addInput("con", new Classic.Input(socketBoolean, "условие"));
    }



    serialize() {
        return {};
    }
}
