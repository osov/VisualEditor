import { ClassicPreset as Classic } from "rete"
import { socketAction } from "../sockets"
import { UserControl } from "../controls"
import { TextareaControl } from "../controls"
import { TwoButtonControl } from "../controls"

export class DialogNode extends Classic.Node {
    width = 240
    height = 340
    private area: any;
    private heightOut = 36;
    nodeTitle = { ru: "Диалог", type: "green" };
    outputs2: any;
    controls2: any;
    userList = [
        {id: 1, name: "Tom", ava: "https://dummyimage.com/600x400/000/fff&text=111"},
        {id: 2, name: "Tom 2", ava: "https://dummyimage.com/500x400/000/fff&text=222"},
        {id: 3, name: "Tom 3", ava: "https://dummyimage.com/700x400/000/fff&text=333"}
    ]  
    currentUser = 0  
    text = "hello world!"
    answers = []

    async setUser(e: any){
        this.currentUser = e;
        (this.controls as any)['User'].currentUser = this.currentUser;
        await this.area.update("control", (this.controls as any)['User'].id);
    }

    async setTextarea(e: any){
        this.text = e;
        (this.controls as any)['Textarea'].text = this.text;
        await this.area.update("control", (this.controls as any)['Textarea'].id);
    }

    async makeOutputs(cnt: number) {
        for (let i = 1; i <= cnt; i++) {
          const o = new Classic.Output(socketAction)
          this.addOutput(`o${i}`, o)
          this.outputs2 = Object.entries(this.outputs)
          this.answers.push(`ответ ${i}`)
          this.height += this.heightOut
        }
        await this.area.update("node", this.id)
      }
    
      async incrementOutput(cnt: number) {
        const o = new Classic.Output(socketAction)
        this.addOutput(`o${cnt}`, o)
        this.outputs2 = Object.entries(this.outputs)
        this.answers.push(`ответ ${cnt}`)
        this.height += this.heightOut
        await this.area.update("node", this.id)
      }
    
      async decrementOutput(cnt: number) {
        const indexOut = `o${cnt}`
        // get id connection this output
        const itemCon = this.area.parent.connections.find((el: any) => el.source === this.id && el.sourceOutput === indexOut)
        // delete connection если есть
        if (itemCon)
          await this.area.removeConnectionView(itemCon.id)
        this.removeOutput(indexOut)
        this.outputs2 = Object.entries(this.outputs)
        this.answers.pop()
        this.height -= this.heightOut
        await this.area.update("node", this.id)
      }

    constructor(num_outputs = 2) {
        super("Dialog")
        this.area = (window as any).area;

        this.addControl("User", new UserControl(this.userList, this.currentUser, async (e) => await this.setUser(e) ))
        this.addControl("Textarea", new TextareaControl(this.text, async (e) => await this.setTextarea(e)))
        this.makeOutputs(num_outputs);
        this.addControl(
          "TwoBtn",
          new TwoButtonControl("-", "+",
            async () => { // btn -
              if (num_outputs > 2) {
                await this.decrementOutput(num_outputs);
                num_outputs--;
              }
            },
            async () => {  // btn +
              num_outputs++;
              await this.incrementOutput(num_outputs);
            }
          )
        )

    }

    serialize() {
        return {
            val: Object.keys(this.outputs).length
        }
    }
}
