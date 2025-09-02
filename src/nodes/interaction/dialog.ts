import { ClassicPreset as Classic } from "rete"
import { socketAction, socketAny, socketBoolean, socketString } from "../../sockets"
import { SelectControl, UserControl } from "../../controls"
import { TextareaControl } from "../../controls"
import { TwoButtonControl } from "../../controls"
import { arrayToSelectList } from "../../utils/utils"

interface DialogParams {
  cnt: number,
  text: string,
  answers: string[]
  index:string
}

export class DialogNode extends Classic.Node {
  width = 240
  height = 300
  private heightOut = 32;
  private area = (window as any).area;
  nodeTitle = { ru: "Диалог", type: "green" };
  outputs2: any;
  inputs2: any = null;
  userList: any = [];
  // serialize data
  currentIndex = ''
  text = ""
  answers: string[] = []

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
        const inp = new Classic.Input(inpSockets == 'b' ? socketBoolean : socketAny)
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
      const inp = new Classic.Input(inpSockets == 'b' ? socketBoolean : socketAny)
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
      initial = { cnt: 2, index: '',  text: '', answers: ['', ''] }
    let { cnt } = initial;
    this.answers = initial.answers
    this.text = initial.text
    this.currentIndex = initial.index
    this.updateList();
    this.addInput("in", new Classic.Input(socketAction, "", true));
    this.addControl("select", new SelectControl(this.currentIndex, this.userList, (e) => this.setUser(e)))

    this.addControl("Textarea", new TextareaControl(this.text, (e) => this.setTextarea(e)));

    this.makeOutputs(cnt, 's');
    this.addControl(
      "TwoBtn",
      new TwoButtonControl("-", "+",
        async () => { // btn -
          if (cnt > 1) {
            await this.decrementOutput(cnt, 's');
            cnt--;
          }
        },
        async () => {  // btn +
          cnt++;
          await this.incrementOutput(cnt, 's');
        }
      )
    )
  }

  serialize(): DialogParams {

    return {
      cnt: this.answers.length,
      text: this.text,
      answers: JSON.parse(JSON.stringify(this.answers)),
      index: this.currentIndex
    }
  }
}