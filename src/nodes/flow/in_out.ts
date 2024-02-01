import { ClassicPreset as Classic } from 'rete'

import { socketAction } from '../../sockets';


export class InOutNode extends Classic.Node {
    width = 180;
    height = 100;
    nodeTitle = { ru: "Вход/Выход", type: "green" }

    constructor() {
        super("InOut");

        this.addInput("in", new Classic.Input(socketAction, "", true));
        this.addOutput("out", new Classic.Output(socketAction, ""));
    }

    serialize() {
        return {
        };
    }
}
