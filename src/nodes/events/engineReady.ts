import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'
import { TitleNodeControl } from '../../controls';

export class EngineReadyNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }>
{
    width = 180;
    height = 80;

    constructor() {
        super("EngineReady");
        this.addControl("TitleNode", new TitleNodeControl("Движок загружен", 'red'))
        this.addOutput("out", new Classic.Output(socketAction, ""));
    }

    serialize() {
        return {};
    }
}
