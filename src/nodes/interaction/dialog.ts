import { ClassicPreset as Classic } from "rete"
import { socketAction, socketBoolean, socketString } from "../../sockets"
import { UserControl } from "../../controls"
import { TextareaControl } from "../../controls"
import { TwoButtonControl } from "../../controls"
import { arrayToSelectList } from "../../utils/utils"

interface DialogParams {
  cnt: number,
  si: string,
  user: string,
  text: string,
  answers: string[]
}

export class DialogNode extends Classic.Node {
  width = 240
  height = 360
  private area = (window as any).area;
  private heightOut = 32;
  nodeTitle = { ru: "Диалог", type: "green" };
  outputs2: any;
  inputs2: any = null;
  userList: any = [];
  // serialize data
  socketsInputs = ''
  currentUser = ''
  text = ""
  answers: string[] = []

  async setUser(id: string) {
    if (id == 'new') {
      const v = prompt('Имя для персонажа');
      if (!v) {
        id = this.currentUser
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
          id = this.currentUser
        }
        else {
          dataManager.add_character(v);
          this.updateList();
          id = this.userList[this.userList.length - 1].val;
        }
      }
    }

    this.currentUser = id;
    (this.controls as any)['User'].userList = this.userList;
    (this.controls as any)['User'].currentUser = this.currentUser;
    (this.controls as any)['User'].ava = './img/avatar.png';
    await this.area.update("control", (this.controls as any)['User'].id);
  }

  async setTextarea(text: string) {
    this.text = text;
    (this.controls as any)['Textarea'].text = this.text;
    await this.area.update("control", (this.controls as any)['Textarea'].id);
  }

  async makeOutputs(cnt: number, inpSockets: string) {
    for (let i = 0; i < cnt; i++) {
      const o = new Classic.Output(socketAction)
      this.addOutput(`out${i}`, o)
      this.outputs2 = Object.entries(this.outputs)
      if (inpSockets) {
        const inp = new Classic.Input(inpSockets == 'b' ? socketBoolean : socketString)
        this.addInput(`in${i}`, inp);
        this.inputs2 = Object.entries(this.inputs)
      }
      //  this.answers.push(`ответ ${i}`)
      this.height += this.heightOut
    }
    await this.area.update("node", this.id)
  }

  async incrementOutput(cnt: number, inpSockets: string) {
    const o = new Classic.Output(socketAction)
    this.addOutput(`out${cnt - 1}`, o)
    this.outputs2 = Object.entries(this.outputs)
    if (inpSockets) {
      const inp = new Classic.Input(inpSockets == 'b' ? socketBoolean : socketString)
      this.addInput(`in${cnt - 1}`, inp);
      this.inputs2 = Object.entries(this.inputs)
    }
    this.answers.push(``)
    this.height += this.heightOut
    await this.area.update("node", this.id)
  }

  async decrementOutput(cnt: number, inpSockets: string) {
    const indexOut = `out${cnt - 1}`
    // get id connection this output
    const itemCon = this.area.parent.connections.find((el: any) => el.source === this.id && el.sourceOutput === indexOut)
    // delete connection если есть
    if (itemCon)
      await this.area.removeConnectionView(itemCon.id)
    this.removeOutput(indexOut)
    this.outputs2 = Object.entries(this.outputs)
    if (inpSockets) {
      const indexInp = `in${cnt - 1}`
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

  updateList() {
    this.userList = arrayToSelectList(dataManager.get_characters())
    this.userList.unshift({ val: 'new', text: '-НОВЫЙ-' })
  }

  constructor(initial?: DialogParams) {
    super("Dialog")
    if (!initial || Object.keys(initial).length == 0)
      initial = { cnt: 2, si: '', user: '', text: '', answers: ['', ''] }
    let { cnt, si } = initial;
    this.answers = initial.answers
    this.currentUser = initial.user
    this.socketsInputs = si
    this.text = initial.text
    this.updateList();
    this.addInput("in", new Classic.Input(socketAction, "", true));
    this.addControl("User", new UserControl(this.userList, this.currentUser, (e) => this.setUser(e)));
    if (this.socketsInputs == 's') {
      this.addInput("in_text", new Classic.Input(socketString, "Текст"));
      this.height -= 110;
    }
    else
      this.addControl("Textarea", new TextareaControl(this.text, (e) => this.setTextarea(e)));
    (this.controls as any)['User'].ava = './img/avatar.png';

    this.makeOutputs(cnt, si);
    this.addControl(
      "TwoBtn",
      new TwoButtonControl("-", "+",
        async () => { // btn -
          if (cnt > 1) {
            await this.decrementOutput(cnt, si);
            cnt--;
          }
        },
        async () => {  // btn +
          cnt++;
          await this.incrementOutput(cnt, si);
        }
      )
    )
  }

  serialize(): DialogParams {

    return {
      cnt: this.answers.length,
      si: this.socketsInputs,
      user: this.currentUser,
      text: this.text,
      answers: this.answers
    }
  }
}
