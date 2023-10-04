import { ClassicPreset as Classic } from 'rete'
import { socketNumber } from '../sockets'


export class AddNode extends Classic.Node<{ A: Classic.Socket; B: Classic.Socket }, { sum: Classic.Socket }>
{
    width = 180;
    height = 190;
    nodeTitle = { ru: "A + B", type: "green" }

    constructor(initial?: { A?: number; B?: number }) {
        super("Add");

        const left = new Classic.Input(socketNumber, "A");
        const right = new Classic.Input(socketNumber, "B");

        left.addControl(new Classic.InputControl("number", { initial: initial?.A || 0, }));
        right.addControl(new Classic.InputControl("number", { initial: initial?.B || 0 }));

        this.addInput("A", left);
        this.addInput("B", right);
        this.addOutput("sum", new Classic.Output(socketNumber, "Результат"));
    }

    serialize() {
        const leftControl = this.inputs["A"]?.control;
        const rightControl = this.inputs["B"]?.control;

        return {
            A: (leftControl as Classic.InputControl<"number">).value,
            B: (rightControl as Classic.InputControl<"number">).value
        };
    }
}
