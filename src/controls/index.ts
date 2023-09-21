import { ClassicPreset as Classic } from "rete"

export class TwoButtonControl extends Classic.Control {
  constructor(
    public label1: string,
    public label2: string,
    public onClick1: () => void,
    public onClick2: () => void
  ) {
    super()
  }
}
