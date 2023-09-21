import { ClassicPreset as Classic, GetSchemes, NodeEditor } from "rete"
import { socket } from "../sockets"
import { TwoButtonControl } from "../controls"

export class SequenceNode extends Classic.Node {
  width = 200
  height = 200

  constructor() {
    super("Последовательность")

    this.addInput("val", new Classic.Input(socket, "Inp"))
    this.addOutput("o1", new Classic.Output(socket, "Out1"))
    this.addOutput("o2", new Classic.Output(socket, "Out2"))
    this.addControl(
      "TwoBtn",
      new TwoButtonControl(
        "-",
        "+",
        async () => {
          // btn -
          const count = Object.keys(this.outputs).length
          if (count > 2) {
            const indexOut = `o${count}`
            // get id connection this output
            const itemCon = area.parent.connections.find(
              (el: any) => el.source === this.id && el.sourceOutput === indexOut
            )
            // delete connection если есть
            if (itemCon){await area.removeConnectionView(itemCon.id)}
            this.removeOutput(indexOut)
            this.height -= 30
            // console.table(this.outputs)
            await area.update("node", this.id)

          }
        },
        () => {
          // btn +
          console.log("H: " + this.height)
          const count = Object.keys(this.outputs).length + 1
          const out = new Classic.Output(socket, `Out${count}`)
          this.addOutput(`o${count}`, out)
          this.height += 30
          console.table(this.outputs)
            area.update("node", this.id)
        }
      )
    )
  }

  serialize() {
    return {
      value: this.outputs
    }
  }
}
