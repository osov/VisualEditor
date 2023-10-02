import { ClassicPreset as Classic } from 'rete'

import { socketAction, socketNumber } from '../sockets';


export class DelayNode extends Classic.Node {
    width = 180;
    height = 160;
    nodeTitle: { ru: string, type: string }

    constructor(delay = 500) {
        super("Delay");
        this.nodeTitle = { ru: "Задержка", type: "green" }

        this.addInput("in", new Classic.Input(socketAction, ""));
        this.addOutput("out", new Classic.Output(socketAction, ""));

        const time = new Classic.Input(socketNumber, "задержка[мс]");
        time.addControl(new Classic.InputControl("number", { initial: delay, }));
        this.addInput("ms", time);
    }

    serialize() {
        const ms = this.inputs["ms"]?.control;
        return {
            ms: (ms as Classic.InputControl<"number">).value,
        };
    }
}
