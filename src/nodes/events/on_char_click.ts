import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'
import { arrayToSelectList } from '../../utils/utils';
import { SelectControl } from '../../controls';

export class OnCharClickNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }>
{
    width = 180;
    height = 100;
    private area = (window as any).area;
    nodeTitle = { ru: "Клик на персонажа", type: "red" }
    listName: { val: string, text: string }[] = []
    currentIndex = ''

    updateList() {
        this.listName = arrayToSelectList(dataManager.get_characters())
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
        super("OnCharClick");
        this.currentIndex = initial || ''
        this.updateList();
        this.addControl("select", new SelectControl(this.currentIndex, this.listName, (e) => this.changeName(e), () => this.doUpdateList()))
        this.addOutput("out", new Classic.Output(socketAction, ""))
    }

    serialize() {
        return {
            id: this.currentIndex,
        }
    }
}
