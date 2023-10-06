import { ClassicPreset as Classic } from "rete"
import { socketAction, socketString, socketBoolean, socketNumber, socketColor, socketAny } from "../sockets"

export class VarSetNode extends Classic.Node<{ in: Classic.Socket, data: Classic.Socket }, {}, { val: Classic.InputControl<"text"> }> {
    width = 180
    height = 100
    nodeTitle = { ru: "Задать", type: "green" }
    params: any

    constructor(initial: { t: string, n: string, g: number }) {
        super("VarSet")
        this.params = initial
        this.nodeTitle = { ru: "Задать: " + initial.n, type: "green" }
        this.addInput("in", new Classic.Input(socketAction, "", true))

        if (initial.t == 's')
            this.addInput("data", new Classic.Input(socketString, "значение", true))
        else if (initial.t == 'n')
            this.addInput("data", new Classic.Input(socketNumber, "значение", true))
        else if (initial.t == 'b')
            this.addInput("data", new Classic.Input(socketBoolean, "значение", true))
        else if (initial.t == 'c')
            this.addInput("data", new Classic.Input(socketColor, "значение", true))
        else
            this.addInput("data", new Classic.Input(socketAny, "значение", true))
    }

    serialize() {
        return this.params;
    }
}
