import { ClassicPreset as Classic } from 'rete'
import { socketAny, socketColor, socketNumber, socketString } from '../../sockets'
import { booleanType } from 'ant-design-vue/es/_util/type';


export class AnyToCustomNode extends Classic.Node {
    width = 180;
    height = 110;
    nodeTitle = { ru: "", type: "green" }

    constructor(to_socket: string, to_string: string, node_name: string, node_title: string) {
        super(node_name);
        this.nodeTitle.ru = node_title;

        this.addInput("in", new Classic.Input(socketAny, "данные"));

        if (to_socket == 'string')
            this.addOutput("out", new Classic.Output(socketString, to_string));
        else if (to_socket == 'boolean')
            this.addOutput("out", new Classic.Output(booleanType, to_string));
        else if (to_socket == 'number')
            this.addOutput("out", new Classic.Output(socketNumber, to_string));
        else if (to_socket == 'color')
            this.addOutput("out", new Classic.Output(socketColor, to_string));

    }

    serialize() {
        return {}
    }
}
