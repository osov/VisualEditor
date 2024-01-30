import { ClassicPreset as Classic } from 'rete'
import { socketAny, socketString } from '../../sockets'
import { booleanType } from 'ant-design-vue/es/_util/type';


export class AnyToBooleanNode extends Classic.Node {
    width = 180;
    height = 110;
    nodeTitle = { ru: "В логическое", type: "green" }

    constructor() {
        super("AnyToBoolean");

        this.addInput("in", new Classic.Input(socketAny, "данные"));
        this.addOutput("out", new Classic.Output(booleanType, "Логическое"));
    }

    serialize() {
        return {}
    }
}
