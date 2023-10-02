import { ClassicPreset as Classic } from 'rete'
import { socketNumber } from '../sockets'


export class AddNode extends Classic.Node<{ A: Classic.Socket; B: Classic.Socket }, { sum: Classic.Socket }>
{
    width = 180;
    height = 190;
    constructor(change?: (value: number) => void, initial?: { A?: number; B?: number }) {
        super("Add");
        this.nodeTitle = {ru: "Добавить", type: "green"}

        const left = new Classic.Input(socketNumber, "A");
        const right = new Classic.Input(socketNumber, "B");

        left.addControl(
            new Classic.InputControl("number", {
                initial: initial?.A || 0,
                change
            })
        );
        right.addControl(
            new Classic.InputControl("number", {
                initial: initial?.B || 0,
                change
            })
        );

        this.addInput("A", left);
        this.addInput("B", right);
        this.addOutput("sum", new Classic.Output(socketNumber, "A + B"));
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
