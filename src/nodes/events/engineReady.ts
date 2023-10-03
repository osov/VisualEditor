import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'

export class EngineReadyNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }>
{
    width = 180;
    height = 80;
    nodeTitle: { ru: string, type: string }
    
    constructor() {
        super("EngineReady");
        this.nodeTitle = {ru: "Движок загружен", type: "red"}

        this.addOutput("out", new Classic.Output(socketAction, ""));
    }

    serialize() {
        return {};
    }
}
