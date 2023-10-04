import { ClassicPreset as Classic } from "rete"
import { socketAction } from "../sockets"
import { UserControl } from "../controls"

export class DialogNode extends Classic.Node {
    width = 240
    height = 340
    private area: any;
    private heightOut = 36;
    nodeTitle: { ru: string, type: string }
    outputs2: any;
    userList = [
        {id: 1, name: "Tom", ava: "https://dummyimage.com/600x400/000/fff&text=111"},
        {id: 2, name: "Tom 2", ava: "https://dummyimage.com/500x400/000/fff&text=222"},
        {id: 3, name: "Tom 3", ava: "https://dummyimage.com/700x400/000/fff&text=333"}
    ]  
    currentUser = 0  

    async setUser(e: any){
        console.log('change', e);
        this.currentUser = e;
        (this.controls as any)['User'].currentUser = this.currentUser;
        await this.area.update("control", (this.controls as any)['User'].id);
    }

    constructor(num_outputs = 2) {
        super("Dialog")
        this.nodeTitle = { ru: "Диалог", type: "green" }
        this.area = (window as any).area;

        this.addControl("User", new UserControl(this.userList, this.currentUser, async (e) => await this.setUser(e) ))
        // this.addInput("in", new Classic.Input(socketAction, "", true))


    }

    serialize() {
        return {
            val: Object.keys(this.outputs).length
        }
    }
}
