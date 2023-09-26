import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../sockets'

export class EngineReadyNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }>
{
    width = 180;
    height = 140;
    constructor() {
        super("EngineReady");
        this.addOutput("out", new Classic.Output(socketAction, ""));
    }

    serialize() {
        return {};
    }
}
