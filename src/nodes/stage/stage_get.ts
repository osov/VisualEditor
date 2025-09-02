import { ClassicPreset as Classic } from 'rete'
import { socketNumber } from '../../sockets';

export class StageGetNode extends Classic.Node {
    width = 180;
    height = 70;
    private area = (window as any).area;
    nodeTitle = { ru: "Текущий этап", type: "yellow" }
  

    constructor() {
        super("StageGet");
        this.addOutput("out", new Classic.Output(socketNumber, "этап"))
    }

    serialize() {
        return {
        }
    }
}
