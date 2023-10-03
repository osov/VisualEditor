import { ClassicPreset as Classic } from 'rete'
import { socketBoolean } from '../../sockets'
import { CheckboxControl } from "../../controls"

export class BooleanNode
    extends Classic.Node {
    width = 180;
    height = 140;
    private area: any;
    nodeTitle: { ru: string, type: string };
    text: string = "Истина";
    active = true;

    async toogleCheckbox() {

        this.active = !this.active
        this.text = !this.active ? "Ложь" : "Истина"

        // this.height += 20  // - это работает

        console.log("click", { a: this.active, t: this.text }, this.id);
        (this.controls as any)['Checkbox'].active = this.active;
        (this.controls as any)['Checkbox'].text = this.text
        await this.area.update("control", (this.controls as any)['Checkbox'].id);

    }


    constructor(initial: string) {
        super("Boolean");
        this.nodeTitle = { ru: "Логическое", type: "yellow" }
        this.area = (window as any).area;

        this.addControl("Checkbox", new CheckboxControl(this.text, this.active, async () => await this.toogleCheckbox()))

        this.addOutput("out", new Classic.Output(socketBoolean, "логическое"))

    }

    serialize() {
        return {
            val: this.active
        };
    }
}
