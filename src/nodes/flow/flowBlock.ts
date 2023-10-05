import { ClassicPreset as Classic } from "rete"
import { socketAction } from "../../sockets"
import { CheckboxControl } from "../../controls"
import { SelectControl } from "../../controls"

export class FlowBlockNode extends Classic.Node {
    width = 180
    height = 160
    private area = (window as any).area;
    nodeTitle = { ru: "Управляемый блок", type: "green" };
    active: boolean = true;
    listName: { val: string, text: string }[] = []
    currentIndex = ''

    async toogleCheckbox() {
        this.active = !this.active;
        (this.controls as any)['Checkbox'].active = this.active;
        await this.area.update("control", (this.controls as any)['Checkbox'].id);
    }

    async changeName(id: string) {
        if (id == 'new') {
            const v = prompt('Имя для блока');
            if (!v) {
                id = this.currentIndex
            }
            else {
                if (dataManager.get_flow_list().includes(v)) {
                    toastr.error('Блок с таким именем уже существует !');
                    id = this.currentIndex
                }
                else {
                    dataManager.add_flow_list(v);
                    this.updateList();
                    id = this.listName[this.listName.length - 1].val;
                }
            }
        }
        this.currentIndex = id;

        (this.controls as any)['select'].optionList = this.listName;
        (this.controls as any)['select'].selected = this.currentIndex;
        await this.area.update("control", (this.controls as any)['select'].id);
    }

    updateList() {
        const list = dataManager.get_flow_list();
        this.listName = [{ val: 'new', text: '-НОВЫЙ-' }];
        for (let i = 0; i < list.length; i++) {
            const text = list[i];
            this.listName.push({ val: i + '', text })
        }
    }

    constructor(initial: { id: string, ac: boolean }) {
        super("FlowBlock")
        this.currentIndex = initial.id || ''
        this.active = initial.ac || false
        this.updateList();
        this.addInput("in", new Classic.Input(socketAction, ""));
        this.addOutput("out", new Classic.Output(socketAction, ""));
        this.addControl("select", new SelectControl(this.currentIndex, this.listName, (e) => this.changeName(e)))
        this.addControl("Checkbox", new CheckboxControl("выключен", "включен", this.active, () => this.toogleCheckbox(), true))

    }

    serialize() {
        return {
            id: this.currentIndex,
            ac: this.active
        }
    }
}
