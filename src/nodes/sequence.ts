import { ClassicPreset as Classic, ClassicPreset } from "rete"
import { socketAction } from "../sockets"
import { TwoButtonControl } from "../controls"

export class SequenceNode extends Classic.Node {
  width = 200
  height = 140
  private area: any;
  private heightOut = 36;

  async makeOutputs(cnt: number) {
    for (let i = 1; i <= cnt; i++) {
      const out = new Classic.Output(socketAction, `Выход ${i}`)
      this.addOutput(`out${i}`, out)
      this.height += this.heightOut
    }
    await this.area.update("node", this.id)
  }

  async incrementOutput(cnt: number) {
    const out = new Classic.Output(socketAction, `Выход ${cnt}`)
    this.addOutput(`out${cnt}`, out)
    this.height += this.heightOut
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
    await this.area.update("node", this.id)
  }

  constructor(num_outputs = 2) {
    super("Sequence")
    this.area = (window as any).area;

    this.addInput("in", new Classic.Input(socketAction, ""))
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
