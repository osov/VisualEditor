import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'

export class StageEventNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }, { val: Classic.InputControl<"number"> }> {
    width = 180;
    height = 100;
    private area = (window as any).area;
    nodeTitle = { ru: "Сменился этап", type: "red" }

    constructor(initial = 0) {
        super('StageEvent');
        this.addControl("val", new Classic.InputControl("number", { initial }));
        this.addOutput("out", new Classic.Output(socketAction, ""))
    }

    serialize() {
        return {
            id: this.controls.val.value
        }
    }
}
