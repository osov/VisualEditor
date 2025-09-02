import { ClassicPreset as Classic } from "rete"
import { socketAction } from "../../sockets"
import { CheckboxControl } from "../../controls"
import { SelectControl } from "../../controls"
import { arrayToSelectList } from "../../utils/utils"

export class FlowBlockNode extends Classic.Node {
    width = 180
    height = 140
    private area = (window as any).area;
    nodeTitle = { ru: "Управляемый блок", type: "green" };
    listName: { val: string, text: string }[] = []
    currentIndex = ''
    active: boolean = true;

    public async changeName(id: string) {
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
        this.listName = arrayToSelectList(dataManager.get_flow_list())
        this.listName.unshift({ val: 'new', text: '-НОВЫЙ-' })
    }

    async toogleCheckbox() {
        this.active = !this.active;
        (this.controls as any)['Checkbox'].active = this.active;
        await this.area.update("control", (this.controls as any)['Checkbox'].id);
    }

    constructor(initial: { id: string, active: boolean }) {
        super("FlowBlock")
        this.currentIndex = initial.id || ''
        this.active = initial.active
        this.updateList();
        this.addInput("in", new Classic.Input(socketAction, ""));
        this.addOutput("out", new Classic.Output(socketAction, ""));
        this.addControl("select", new SelectControl(this.currentIndex, this.listName, (e) => this.changeName(e)))
        this.addControl("Checkbox", new CheckboxControl('Если ложь', 'Если истина', this.active, async () => await this.toogleCheckbox()))
    }

    serialize() {
        return {
            id: this.currentIndex,
            active:this.active
        }
    }
}
