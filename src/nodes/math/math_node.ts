import { ClassicPreset as Classic } from 'rete'
import { socketNumber } from '../../sockets'


export class MathNode extends Classic.Node<{ A: Classic.Socket; B: Classic.Socket }, { val: Classic.Socket }>
{
    width = 180;
    height = 140;
    nodeTitle = { ru: "A и B", type: "green" }

    constructor(node_name: string, node_title: string, initial?: { A?: number; B?: number }) {
        super(node_name);
        this.nodeTitle.ru = node_title;

        const left = new Classic.Input(socketNumber, "A");
        const right = new Classic.Input(socketNumber, "B");

        left.addControl(new Classic.InputControl("number", { initial: initial?.A || 0, }));
        right.addControl(new Classic.InputControl("number", { initial: initial?.B || 0 }));

        this.addInput("A", left);
        this.addInput("B", right);
        this.addOutput("val", new Classic.Output(socketNumber, "Результат"));
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
