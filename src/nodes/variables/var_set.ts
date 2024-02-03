import { ClassicPreset as Classic } from "rete"
import { socketAction, socketString, socketBoolean, socketNumber, socketColor, socketAny } from "../../sockets"
import { CheckboxControl } from "../../controls"

export class VarSetNode extends Classic.Node<{ in: Classic.Socket, data: Classic.Socket }, {}, any> {
    width = 200
    height = 100
    nodeTitle = { ru: "Задать", type: "green" }
    private area = (window as any).area;
    params: any
    active: boolean = false;
    textFalse: string = "Ложь";
    textTrue: string = "Истина";

    async toogleCheckbox() {
        this.active = !this.active;
        (this.inputs.data as any).control.active = this.active;
        await this.area.update("control", (this.inputs.data as any).control.id);
    }

    constructor(initial: { t: string, n: string, g: number, v?: any }) {
        super("VarSet")
        this.params = initial
        this.nodeTitle = { ru: "Задать: " + initial.n, type: "green" }
        this.addInput("in", new Classic.Input(socketAction, "", true))

        if (initial.t == 's') {
            const input = new Classic.Input(socketString, "значение");
            input.addControl(new Classic.InputControl("text", { initial: initial.v || '', }));
            this.addInput("data", input);
        }
        else if (initial.t == 'n') {
            const input = new Classic.Input(socketNumber, "значение");
            input.addControl(new Classic.InputControl("number", { initial: initial.v !== undefined ? parseInt(initial.v) : 0, }));
            this.addInput("data", input);
        }
        else if (initial.t == 'b') {
            this.active = initial.v || false
            const input = new Classic.Input(socketBoolean, "значение");
            input.addControl(new CheckboxControl(this.textFalse, this.textTrue, this.active, async () => this.toogleCheckbox()))
            this.addInput("data", input);
        }
        else if (initial.t == 'c') {
            const input = new Classic.Input(socketColor, "значение");
            input.addControl(new Classic.InputControl("text", { initial: initial.v || '#000000', }));
            this.addInput("data", input);
        }
        else
            this.addInput("data", new Classic.Input(socketAny, "значение", false))
    }

    serialize() {
        const leftControl = this.inputs["data"]?.control;
        let v: any = (leftControl as Classic.InputControl<"text">).value;
        if (this.params.t == 'b')
            v = this.active;
        return { ...this.params, v };
    }
}
