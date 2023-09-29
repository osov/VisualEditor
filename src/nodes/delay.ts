import { ClassicPreset as Classic } from 'rete'

import { socketAction, socketNumber } from '../sockets';
import { TitleNodeControl } from '../controls';


export class DelayNode extends Classic.Node {
    width = 180;
    height = 140;
    constructor(delay = 500) {
        super("Delay");

        this.addControl("TitleNode", new TitleNodeControl("Задержка"))
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
