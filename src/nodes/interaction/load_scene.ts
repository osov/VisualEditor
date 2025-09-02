import { ClassicPreset as Classic } from "rete"
import { socketAction } from "../../sockets"

export class LoadSceneNode extends Classic.Node<{ in: Classic.Socket }, { out: Classic.Socket }, {val: Classic.InputControl<"text">}> {
    width = 190
    height = 120
    private area = (window as any).area;
    nodeTitle = { ru: "Загрузить сцену", type: "green" };

    constructor(initial: string) {
        super("LoadScene")

        this.addInput("in", new Classic.Input(socketAction, "", true));
        this.addControl("val", new Classic.InputControl("text", { initial }));
    }

    serialize() {
        return {
            id: this.controls.val.value
        }
    }
}
