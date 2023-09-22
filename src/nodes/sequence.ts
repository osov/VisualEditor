import { ClassicPreset as Classic } from "rete"
import { socket } from "../sockets"
import { TwoButtonControl } from "../controls"

export class SequenceNode extends Classic.Node {
  width = 200
  height = 140
  private area: any;

  async makeOutputs(cnt: number) {
    const count = Object.keys(this.outputs).length;

    for (let i = 1; i <= count; i++) {
      const indexOut = `o${i}`
      // get id connection this output
      const itemCon = this.area.parent.connections.find((el: any) => el.source === this.id && el.sourceOutput === indexOut)
      // delete connection если есть
      if (itemCon)
        await this.area.removeConnectionView(itemCon.id)
      this.removeOutput(indexOut)
      this.height -= 30
      await this.area.update("node", this.id)
    }

    for (let i = 1; i <= cnt; i++) {
      const out = new Classic.Output(socket, `Out${i}`)
      this.addOutput(`o${i}`, out)
      this.height += 30
      await this.area.update("node", this.id)
    }
  }

  constructor(num_outputs = 2) {
    super("Последовательность")
    this.area = (window as any).area;

    this.addInput("val", new Classic.Input(socket, "Inp"))
    this.makeOutputs(num_outputs);
    this.addControl(
      "TwoBtn",
      new TwoButtonControl("-", "+",
        async () => { // btn -
          if (num_outputs > 2) {
            num_outputs--;
            await this.makeOutputs(num_outputs);
          }
        },
        async () => {  // btn +
          num_outputs++;
          await this.makeOutputs(num_outputs);
        }
      )
    )
  }

  serialize() {
    return {
      value: Object.keys(this.outputs).length
    }
  }
}
