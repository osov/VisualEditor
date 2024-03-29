import { ClassicPreset as Classic, NodeEditor } from 'rete'
import { socketAction, socketAny } from '../../sockets'
import { Module, Modules } from "../../utils/modules"
import { Schemes } from "../../editor"
import { OneButtonControl } from "../../controls"

export class ModuleNode
    extends Classic.Node<Record<string, Classic.Socket>, Record<string, Classic.Socket>, { name: Classic.InputControl<"text">, OneBtn: OneButtonControl }>
{
    add_height = 150 - 90
    width = 180
    height = 160
    module: null | Module<Schemes> = null
    nodeTitle: { ru: string, type: string, module: string }

    constructor(public path: string, private findModule: (path: string) => null | Module<Schemes>, private reset: (nodeId: string) => Promise<void>) {
        super("Module")
        this.nodeTitle = { ru: "Модуль", type: "blue", module: path }
        //this.addControl("OneBtn", new OneButtonControl("Изменить", async () => openModule(path)))
        this.update()
    }

    async update() {
        this.module = this.findModule(this.path)

        await this.reset(this.id)
        if (this.module) {
            const editor = new NodeEditor<Schemes>()
            await this.module.apply(editor)

            const { inputs_data, outputs_data, inputs_actions, outputs_actions } = Modules.getPorts(editor)
            this.syncPorts(inputs_data, inputs_actions, outputs_data, outputs_actions)
        } else this.syncPorts([], [], [], [])
    }

    syncPorts(inputs_data: string[], inputs_actions: string[], outputs_data: string[], outputs_actions: string[]) {
        Object.keys(this.inputs).forEach((key: keyof typeof this.inputs) =>
            this.removeInput(key)
        )
        Object.keys(this.outputs).forEach((key: keyof typeof this.outputs) =>
            this.removeOutput(key)
        )

        inputs_data.forEach((key) => {
            this.addInput(key, new Classic.Input(socketAny, key))
        })
        outputs_data.forEach((key) => {
            this.addOutput(key, new Classic.Output(socketAny, key))
        })

        inputs_actions.forEach((key) => {
            this.addInput(key, new Classic.Input(socketAction, key))
        })
        outputs_actions.forEach((key) => {
            this.addOutput(key, new Classic.Output(socketAction, key))
        })


        this.height = this.add_height + 33 * (Object.keys(this.inputs).length + Object.keys(this.outputs).length)
    }

    serialize() {
        return {
            name: this.path
        }
    }
}
