import { ClassicPreset as Classic } from 'rete'

import { socketAction, socketBoolean } from '../../sockets';


export class IfElseNode extends Classic.Node {
    width = 180;
    height = 180;
    nodeTitle = { ru: "Условный выбор", type: "green" }

    constructor() {
        super("IfElse");
        this.addInput("in", new Classic.Input(socketAction, ""));
        this.addOutput("then", new Classic.Output(socketAction, "Истина"));
        this.addOutput("else", new Classic.Output(socketAction, "Ложь"));
        this.addInput("con", new Classic.Input(socketBoolean, "условие"));
    }



    serialize() {
        return {};
    }
}
