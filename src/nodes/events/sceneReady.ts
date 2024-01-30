import { ClassicPreset as Classic } from 'rete'
import { socketAction } from '../../sockets'

export class SceneReadyNode extends Classic.Node<{ _: Classic.Socket }, { out: Classic.Socket }>
{
    width = 180;
    height = 70;
    nodeTitle = { ru: "Сцена загружена", type: "red" }

    constructor() {
        super("SceneReady");

        this.addOutput("out", new Classic.Output(socketAction, ""));
    }

    serialize() {
        return {};
    }
}
