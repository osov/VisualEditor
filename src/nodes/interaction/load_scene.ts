import { ClassicPreset as Classic } from "rete"
import { socketAction } from "../../sockets"
import { SelectControl } from "../../controls"
import { arrayToSelectList } from "../../utils/utils"

export class LoadSceneNode extends Classic.Node {
    width = 190
    height = 120
    private area = (window as any).area;
    nodeTitle = { ru: "Загрузить сцену", type: "green" };
    listName: { val: string, text: string }[] = []
    currentIndex = ''


    async changeName(id: string) {
        this.updateList();
        this.currentIndex = id;
        log(id);
        (this.controls as any)['select'].optionList = this.listName;
        (this.controls as any)['select'].selected = this.currentIndex;
        await this.area.update("control", (this.controls as any)['select'].id);
    }

    updateList() {
        this.listName = arrayToSelectList(dataManager.get_all_scenes())
        for (let i = 0; i < this.listName.length; i++) {
            const it = this.listName[i];
            this.listName[i].text = it.text.substr('scene_'.length);
        }
    }

    doUpdateList() {
        this.updateList();
        (this.controls as any)['select'].optionList = this.listName;
        this.area.update("control", (this.controls as any)['select'].id);
    }

    constructor(initial: string) {
        super("LoadScene")
        this.currentIndex = initial || ''
        this.updateList();

        this.addInput("in", new Classic.Input(socketAction, "", true));
        this.addControl("select", new SelectControl(this.currentIndex, this.listName, (e) => this.changeName(e), () => this.doUpdateList()))
    }

    serialize() {
        return {
            id: this.currentIndex,
        }
    }
}
