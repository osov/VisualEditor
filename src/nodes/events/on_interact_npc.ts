import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'
import { arrayToSelectList } from '../../utils/utils';
import { SelectControl } from '../../controls';

export class OnInteractNPCNode extends Classic.Node {
    width = 220;
    height = 100;
    private area = (window as any).area;
    nodeTitle = { ru: "Взаимодействие с NPC", type: "red" }
    userList: any = [];
    currentIndex = ''

    async setUser(id: string) {
        if (id == 'new') {
            const v = prompt('Имя для персонажа');
            if (!v) {
                id = this.currentIndex
            }
            else {
                const characters = dataManager.get_characters();
                let has = false;
                for (let i = 0; i < characters.length; i++) {
                    if (characters[i].name == v) {
                        has = true;
                        break;
                    }

                }
                if (has) {
                    toastr.error('Персонаж с таким именем уже существует !');
                    id = this.currentIndex
                }
                else {
                    dataManager.add_character(v);
                    this.updateList();
                    id = this.userList[this.userList.length - 1].val;
                }
            }
        }
        this.currentIndex = id;
        (this.controls as any)['select'].optionList = this.userList;
        (this.controls as any)['select'].selected = this.currentIndex;
        await this.area.update("control", (this.controls as any)['select'].id);
    }

    updateList() {
        this.userList = arrayToSelectList(dataManager.get_characters())
        this.userList.unshift({ val: 'new', text: '-НОВЫЙ-' })
    }

    constructor(initial = '') {
        super("OnInteractNPC");
        this.currentIndex = initial;
        this.updateList();
        this.addControl("select", new SelectControl(this.currentIndex, this.userList, (e) => this.setUser(e)))
        this.addOutput("out", new Classic.Output(socketAction, ""))
    }

    serialize() {
        return {
            id: this.currentIndex
        }
    }
}
