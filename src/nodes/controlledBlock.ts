import { ClassicPreset as Classic } from "rete"
import { socketAction } from "../sockets"
import { CheckboxControl } from "../controls"
import { SelectControl } from "../controls"

export class ControlledBlockNode extends Classic.Node {
    width = 180
    height = 160
    private area: any;
    nodeTitle = { ru: "Управляемый блок", type: "green" };
    active: boolean = true;
    listName = [
        {val: 1, text: "Tomas"},
        {val: 2, text: "Tomas 2"},
        {val: 3, text: "Tomas 3"}
    ]  
    currentName = 0  

    async toogleCheckbox() {
        this.active = !this.active;
        (this.controls as any)['Checkbox'].active = this.active;
        await this.area.update("control", (this.controls as any)['Checkbox'].id);
    }

    async changeName(e: any) {
        this.currentName = e;
        console.log('changeName',e);
        
        (this.controls as any)['select'].selected = this.currentName;
        await this.area.update("control", (this.controls as any)['select'].id);
    }

    constructor(initial: boolean) {
        super("ControlledBlock")
        this.area = (window as any).area;

        this.active = initial
        this.addInput("in", new Classic.Input(socketAction, ""));
        this.addOutput("out", new Classic.Output(socketAction, ""));
        this.addControl("select", new SelectControl(this.currentName, this.listName, async (e) => {await this.changeName(e)}))
        this.addControl("Checkbox", new CheckboxControl("неактивен", "активен", this.active, async () => await this.toogleCheckbox(), true))

    }

    serialize() {
        return {
            val: Object.keys(this.outputs).length
        }
    }
}
