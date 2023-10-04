import { ClassicPreset as Classic } from 'rete'
import { socketBoolean } from '../../sockets'
import { CheckboxControl } from "../../controls"

export class BooleanNode extends Classic.Node {
    width = 180;
    height = 140;
    private area: any;
    nodeTitle: { ru: string, type: string };
    textFalse: string = "Ложь";
    textTrue: string = "Истина";
    active: boolean = true;

    async toogleCheckbox() {
        this.active = !this.active;
        (this.controls as any)['Checkbox'].active = this.active;
        await this.area.update("control", (this.controls as any)['Checkbox'].id);
    }

    constructor(initial: boolean) {
        super("Boolean");
        this.nodeTitle = { ru: "Логическое", type: "yellow" }
        this.area = (window as any).area;

        this.active = initial
        this.addControl("Checkbox", new CheckboxControl(this.textFalse, this.textTrue, this.active, async () => await this.toogleCheckbox()))
        this.addOutput("out", new Classic.Output(socketBoolean, "логическое"))
    }

    serialize() {
        return {
            val: this.active
        };
    }
}