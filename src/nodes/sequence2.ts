import { ClassicPreset as Classic } from "rete"
import { socketAction } from "../sockets"
import { TwoButtonControl } from "../controls"
import { TitleNodeControl } from "../controls"

export class SequenceNode2 extends Classic.Node {
  width = 240
  // height = 140
  height = 320
  private area: any;
  private heightOut = 36;
  list:any = {
    "out1": {
        "socket": {
            "name": "action"
        },
        "label": "Выход 1",
        "multipleConnections": true,
        "id": "1f36e9e5642720c9"
    },
    "out2": {
        "socket": {
            "name": "action"
        },
        "label": "Выход 2",
        "multipleConnections": true,
        "id": "8fe6170d532702bd"
    }
}


  async makeOutputs(cnt: number) {
    for (let i = 1; i <= cnt; i++) {
      const out = new Classic.Output(socketAction, `Выход ${i}`)
      this.addOutput(`out${i}`, out)
      this.height += this.heightOut
    }
    await this.area.update("node", this.id)
    console.log(this);
    
  }

  async incrementOutput(cnt: number) {
    const out = new Classic.Output(socketAction, `Выход ${cnt}`)
    this.addOutput(`out${cnt}`, out)
    this.height += this.heightOut
    // this.list.push({id: this.list.length+1, name: `name${this.list.length+1}`, age: 55})
    const count = Object.keys(this.list).length
    this.list[`out${count+1}`] = {"socket": {"name": "action"},"label": `Выход ${count+1}`,"multipleConnections": true,"id": "8fe6170d532702bd"}
    console.table(this.list)
    await this.area.update("node", this.id)
  }

  async decrementOutput(cnt: number) {
    const indexOut = `out${cnt}`
    // get id connection this output
    const itemCon = this.area.parent.connections.find((el: any) => el.source === this.id && el.sourceOutput === indexOut)
    // delete connection если есть
    if (itemCon)
      await this.area.removeConnectionView(itemCon.id)
    this.removeOutput(indexOut)
    this.height -= this.heightOut
    // this.list.pop()
    await this.area.update("node", this.id)
  }

  constructor(num_outputs = 3) {
    super("Sequence2")
    this.area = (window as any).area;
    this.addControl("TitleNode", new TitleNodeControl("Последоват 2"))

    this.addInput("in", new Classic.Input(socketAction, "", true))
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
