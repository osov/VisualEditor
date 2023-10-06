import { ClassicPreset as Classic } from "rete"
import { socketAction, socketString, socketBoolean, socketNumber, socketColor, socketAny } from "../sockets"

export class VarGetNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }, { val: Classic.InputControl<"number"> }> {
    width = 180
    height = 70
    nodeTitle = { ru: "Получить", type: "green" }
    params: any

    constructor(initial: { t: string, n: string, g: number }) {
        super("VarGet")
        this.params = initial
        this.nodeTitle = { ru: "Получить: " + initial.n, type: "yellow" }

        if (initial.t == 's')
            this.addOutput("out", new Classic.Output(socketString, "значение", true))
        else if (initial.t == 'n')
            this.addOutput("out", new Classic.Output(socketNumber, "значение", true))
        else if (initial.t == 'b')
            this.addOutput("out", new Classic.Output(socketBoolean, "значение", true))
        else if (initial.t == 'c')
            this.addOutput("out", new Classic.Output(socketColor, "значение", true))
        else
            this.addOutput("out", new Classic.Output(socketAny, "значение", true))
    }

    serialize() {
        return this.params;
    }
}
