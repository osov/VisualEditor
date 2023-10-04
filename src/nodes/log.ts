import { ClassicPreset as Classic } from "rete"
import { socketAction, socketAny } from "../sockets"

export class LogNode extends Classic.Node<{ in: Classic.Socket, data: Classic.Socket }, {}, { val: Classic.InputControl<"text"> }> {
    width = 180
    height = 140
    nodeTitle = { ru: "Логировать", type: "green" }

    constructor(text = '') {
        super("Log")
        this.addInput("in", new Classic.Input(socketAction, "", true))

        const data = new Classic.Input(socketAny, "данные");
        data.addControl(new Classic.InputControl("text", { initial: text }))
        this.addInput("data", data)
    }

    serialize() {
        const data = this.inputs["data"]?.control;
        return {
            val: (data as Classic.InputControl<"text">).value,
        };
    }
}
