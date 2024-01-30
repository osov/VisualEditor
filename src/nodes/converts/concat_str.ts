import { ClassicPreset as Classic } from 'rete'
import { socketString } from '../../sockets'


export class ConcatStrNode extends Classic.Node<{ A: Classic.Socket; B: Classic.Socket }, { val: Classic.Socket }>
{
    width = 180;
    height = 140;
    nodeTitle = { ru: "Обьединить строки", type: "green" }

    constructor(initial?: { A?: string; B?: string }) {
        super("ConcatStr");

        const left = new Classic.Input(socketString, "A");
        const right = new Classic.Input(socketString, "B");

        left.addControl(new Classic.InputControl("text", { initial: initial?.A || '', }));
        right.addControl(new Classic.InputControl("text", { initial: initial?.B || '' }));

        this.addInput("A", left);
        this.addInput("B", right);
        this.addOutput("val", new Classic.Output(socketString, "Результат"));
    }

    serialize() {
        const leftControl = this.inputs["A"]?.control;
        const rightControl = this.inputs["B"]?.control;

        return {
            A: (leftControl as Classic.InputControl<"text">).value,
            B: (rightControl as Classic.InputControl<"text">).value
        };
    }
}
