import { ClassicPreset as Classic } from "rete"
import { socketAction, socketBoolean } from "../sockets"
import { UserControl } from "../controls"
import { TextareaControl } from "../controls"
import { TwoButtonControl } from "../controls"

interface DialogParams {
  cnt: number,
  bi: boolean,
  user: string,
  text: string,
  answers: string[]
}

export class DialogNode extends Classic.Node {
  width = 240
  height = 360
  private area = (window as any).area;;
  private heightOut = 32;
  nodeTitle = { ru: "Диалог", type: "green" };
  outputs2: any;
  inputs2: any = null; //  inputBool = false
  userList = dataManager.get_all_characters();
  // serialize data
  booleanInputs = false
  currentUser = ''
  text = ""
  answers: string[] = []

  async setUser(id: string) {
    this.currentUser = id;
    (this.controls as any)['User'].currentUser = this.currentUser;
    await this.area.update("control", (this.controls as any)['User'].id);
  }

  async setTextarea(text: string) {
    this.text = text;
    (this.controls as any)['Textarea'].text = this.text;
    await this.area.update("control", (this.controls as any)['Textarea'].id);
  }

  async makeOutputs(cnt: number, inpBool: boolean) {
    for (let i = 1; i <= cnt; i++) {
      const o = new Classic.Output(socketAction)
      this.addOutput(`o${i}`, o)
      this.outputs2 = Object.entries(this.outputs)
      if (inpBool) {
        const inp = new Classic.Input(socketBoolean)
        this.addInput(`i${i}`, inp);
        this.inputs2 = Object.entries(this.inputs)
      }
      //  this.answers.push(`ответ ${i}`)
      this.height += this.heightOut
    }
    await this.area.update("node", this.id)
  }

  async incrementOutput(cnt: number, inpBool: boolean) {
    const o = new Classic.Output(socketAction)
    this.addOutput(`o${cnt}`, o)
    this.outputs2 = Object.entries(this.outputs)
    if (inpBool) {
      const inp = new Classic.Input(socketBoolean)
      this.addInput(`i${cnt}`, inp);
      this.inputs2 = Object.entries(this.inputs)
    }
    this.answers.push(``)
    this.height += this.heightOut
    await this.area.update("node", this.id)
  }

  async decrementOutput(cnt: number, inpBool: boolean) {
    const indexOut = `o${cnt}`
    // get id connection this output
    const itemCon = this.area.parent.connections.find((el: any) => el.source === this.id && el.sourceOutput === indexOut)
    // delete connection если есть
    if (itemCon)
      await this.area.removeConnectionView(itemCon.id)
    this.removeOutput(indexOut)
    this.outputs2 = Object.entries(this.outputs)
    if (inpBool) {
      const indexInp = `i${cnt}`
      const inpCon = this.area.parent.connections.find((el: any) => el.target === this.id && el.targetInput === indexInp)
      if (inpCon)
        await this.area.removeConnectionView(inpCon.id)
      this.removeInput(indexInp)
      this.inputs2 = Object.entries(this.inputs)
    }
    this.answers.pop()
    this.height -= this.heightOut
    await this.area.update("node", this.id)
  }

  constructor(initial?: DialogParams) {
    super("Dialog")
    if (!initial || Object.keys(initial).length == 0)
      initial = { cnt: 2, bi: false, user: '', text: '', answers: ['', ''] }
    let { cnt, bi } = initial;
    this.answers = initial.answers
    this.currentUser = initial.user
    this.booleanInputs = bi

    this.addInput("in", new Classic.Input(socketAction, ""));
    this.addControl("User", new UserControl(this.userList, this.currentUser, (e) => this.setUser(e)))
    this.addControl("Textarea", new TextareaControl(this.text, (e) => this.setTextarea(e)))

    this.makeOutputs(cnt, bi);
    this.addControl(
      "TwoBtn",
      new TwoButtonControl("-", "+",
        async () => { // btn -
          if (cnt > 2) {
            await this.decrementOutput(cnt, bi);
            cnt--;
          }
        },
        async () => {  // btn +
          cnt++;
          await this.incrementOutput(cnt, bi);
        }
      )
    )


  }

  serialize(): DialogParams {

    return {
      cnt: this.answers.length,
      bi: this.booleanInputs,
      user: this.currentUser,
      text: (this.controls as any).Textarea.value,
      answers: this.answers
    }
  }
}
