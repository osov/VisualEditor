import { ClassicPreset as Classic } from 'rete'
import { socketBoolean } from '../../sockets'
import { SelectControl } from '../../controls';
import { arrayToSelectList } from '../../utils/utils';

export class FlowStatusNode extends Classic.Node {
    width = 180;
    height = 100;
    private area = (window as any).area;
    nodeTitle = { ru: "Активен блок ?", type: "yellow" }
    listName: { val: string, text: string }[] = []
    currentIndex = ''

    updateList() {
        this.listName = arrayToSelectList(dataManager.get_flow_list())
    }

    doUpdateList() {
        this.updateList();
        (this.controls as any)['select'].optionList = this.listName;
        (this.controls as any)['select'].selected = this.currentIndex;
        this.area.update("control", (this.controls as any)['select'].id);
    }

    async changeName(id: string) {
        this.currentIndex = id;

        (this.controls as any)['select'].optionList = this.listName;
        (this.controls as any)['select'].selected = this.currentIndex;
        await this.area.update("control", (this.controls as any)['select'].id);
    }


    constructor(initial = '') {
        super("FlowStatus");
        this.currentIndex = initial || ''
        this.updateList();
        this.addControl("select", new SelectControl(this.currentIndex, this.listName, (e) => this.changeName(e), () => this.doUpdateList()))
        this.addOutput("out", new Classic.Output(socketBoolean, "Состояние"))
    }

    serialize() {
        return {
            id: this.currentIndex,
        }
    }
}
