import { ClassicPreset as Classic } from 'rete'
import { socketBoolean } from '../../sockets'
import { CheckboxControl } from "../../controls"

export class BooleanNode
    extends Classic.Node
{
    width = 180;
    height = 140;
    private area: any;
    nodeTitle: { ru: string, type: string }
    text: string = "Ложь";
    active: boolean = false;

    async toogleCheckbox() {
        console.log("click");
        
        this.active = !this.active
        this.text = this.text === "Истина" ? "Ложь" : "Истина"

        await this.area.update("node", this.id)
    }


    constructor(initial: string) {
        super("Boolean");
        this.nodeTitle = {ru: "Логическое", type: "yellow"}
        this.area = (window as any).area;

        this.toogleCheckbox()
        this.addControl("Checkbox", new CheckboxControl(this.text, this.active, async () => { await this.toogleCheckbox() } ))

        this.addOutput("out", new Classic.Output(socketBoolean, "логическое"))
        this.addControl("val", new Classic.InputControl("checkbox", { initial }));
    }

    serialize() {
        return {
            val: this.active
        };
    }
}
