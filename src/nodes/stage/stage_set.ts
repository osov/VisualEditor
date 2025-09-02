import { ClassicPreset as Classic } from "rete"
import { socketAction, socketNumber } from "../../sockets"

export class StageSetNode extends Classic.Node {
    width = 190
    height = 110
    private area = (window as any).area;
    nodeTitle = { ru: "Сменить этап", type: "green" };

    constructor(initial: number) {
        super("StageSet")
        const stage = new Classic.Input(socketNumber, "id");
        stage.addControl(new Classic.InputControl("number", { initial }));

        this.addInput("in", new Classic.Input(socketAction, ""));
        this.addInput("id", stage);
    }

    serialize() {
        const ctrl = this.inputs["id"]?.control;
        return {
            id: (ctrl as Classic.InputControl<"number">).value
        }
    }
}
