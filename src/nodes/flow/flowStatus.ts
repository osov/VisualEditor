import { ClassicPreset as Classic } from 'rete'
import { socketBoolean } from '../../sockets'
import { SelectControl } from '../../controls';

export class FlowStatusNode extends Classic.Node {
    width = 180;
    height = 140;
    private area = (window as any).area;
    nodeTitle = { ru: "Активен блок ?", type: "yellow" }
    listName: { val: string, text: string }[] = []
    currentIndex = ''

    updateList() {
        this.listName = [];
        const list = dataManager.get_flow_list();
        for (let i = 0; i < list.length; i++) {
            const text = list[i];
            this.listName.push({ val: i + '', text })
        }
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
        this.addOutput("out", new Classic.Output(socketBoolean, "Статус"))
    }

    serialize() {
        return {
            id: this.currentIndex,
        }
    }
}
