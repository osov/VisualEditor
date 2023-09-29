import { ClassicPreset as Classic, NodeEditor } from 'rete'
import { socketAction, socketAny } from '../../sockets'
import { Module, Modules } from "../../utils/modules"
import { Schemes } from "../../editor"
import { OneButtonControl, TitleNodeControl } from "../../controls"

export class ModuleNode
    extends Classic.Node<Record<string, Classic.Socket>, Record<string, Classic.Socket>, { TitleNode: TitleNodeControl, name: Classic.InputControl<"text">, OneBtn: OneButtonControl }>
{
    width = 180
    height = 160
    module: null | Module<Schemes> = null

    constructor(public path: string, private findModule: (path: string) => null | Module<Schemes>, private reset: (nodeId: string) => Promise<void>) {
        super("Module")

        this.addControl("TitleNode", new TitleNodeControl("Модуль", 'blue'))

        this.addControl("name", new Classic.InputControl("text", { initial: path, readonly: true }))
        this.addControl("OneBtn", new OneButtonControl("Изменить", async () => (window as any).openModule(path)))
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


        this.height = 150 + 33 * (Object.keys(this.inputs).length + Object.keys(this.outputs).length)
    }

    serialize() {
        return {
            name: this.controls.name.value
        }
    }
}
