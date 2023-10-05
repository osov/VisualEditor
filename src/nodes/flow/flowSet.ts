import { ClassicPreset as Classic } from "rete"
import { socketAction, socketBoolean } from "../../sockets"
import { CheckboxControl } from "../../controls"
import { SelectControl } from "../../controls"

export class FlowSetNode extends Classic.Node {
    width = 180
    height = 160
    private area = (window as any).area;
    nodeTitle = { ru: "Задать", type: "green" };
    active: boolean = true;
    listName: { val: string, text: string }[] = []
    currentIndex = ''

    async toogleCheckbox() {
        this.active = !this.active;
        (this.inputs as any).status.control.active = this.active;
        await this.area.update("control", (this.inputs as any).status.control.id);
    }

    async changeName(id: string) {
        this.updateList();
        this.currentIndex = id;
        (this.controls as any)['select'].optionList = this.listName;
        (this.controls as any)['select'].selected = this.currentIndex;
        await this.area.update("control", (this.controls as any)['select'].id);
    }

    updateList() {
        const list = dataManager.get_flow_list();
        this.listName = [];
        for (let i = 0; i < list.length; i++) {
            const text = list[i];
            this.listName.push({ val: i + '', text })
        }
    }

    doUpdateList() {
        this.updateList();
        (this.controls as any)['select'].optionList = this.listName;
        this.area.update("control", (this.controls as any)['select'].id);
    }

    constructor(initial: { id: string, ac: boolean }) {
        super("FlowSet")
        this.currentIndex = initial.id || ''
        this.active = initial.ac || false
        this.updateList();
        const status = new Classic.Input(socketBoolean, "Активен");
        status.addControl(new CheckboxControl("нет", "да", this.active, () => this.toogleCheckbox(), false));

        this.addInput("in", new Classic.Input(socketAction, ""));
        this.addControl("select", new SelectControl(this.currentIndex, this.listName, (e) => this.changeName(e), () => this.doUpdateList()))
        this.addInput("status", status);







    }

    serialize() {
        return {
            id: this.currentIndex,
            ac: this.active
        }
    }
}
