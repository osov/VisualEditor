import { ClassicPreset as Classic, NodeEditor } from 'rete'
import { socketAny } from '../../sockets'
import { Module, Modules } from "../../utils/modules";
import { Schemes } from "../../editor";
import { OneButtonControl } from "../../controls"
import { TitleNodeControl } from "../../controls"

export class ModuleNode
    extends Classic.Node<
        Record<string, Classic.Socket>,
        Record<string, Classic.Socket>,
        { module: Classic.InputControl<"text"> }
    >
{
    width = 180;
    height = 160;
    module: null | Module<Schemes> = null;

    constructor(
        public path: string,
        private findModule: (path: string) => null | Module<Schemes>,
        private reset: (nodeId: string) => Promise<void>,
        // updateUI: (nodeId: string) => void
    ) {
        super("Module");

        this.addControl("TitleNode", new TitleNodeControl("Модуль"))

        this.addControl(
            "module",
            new Classic.InputControl("text", {
                initial: path,
                // change: async (value) => {
                //     this.path = value;
                //     await this.update();
                //     updateUI(this.id);
                // }
            })
        );
        this.addControl(
            "OneBtn",
            new OneButtonControl("Изменить",
              async () => { 
                console.log('click one btn')
              }
            )
          )
        this.update();
        
    }

    async update() {
        this.module = this.findModule(this.path);

        await this.reset(this.id);
        if (this.module) {
            const editor = new NodeEditor<Schemes>();
            await this.module.apply(editor);

            const { inputs, outputs } = Modules.getPorts(editor);
            this.syncPorts(inputs, outputs);
        } else this.syncPorts([], []);
    }

    syncPorts(inputs: string[], outputs: string[]) {
        Object.keys(this.inputs).forEach((key: keyof typeof this.inputs) =>
            this.removeInput(key)
        );
        Object.keys(this.outputs).forEach((key: keyof typeof this.outputs) =>
            this.removeOutput(key)
        );

        inputs.forEach((key) => {
            this.addInput(key, new Classic.Input(socketAny, key));
        });
        outputs.forEach((key) => {
            this.addOutput(key, new Classic.Output(socketAny, key));
        });
        this.height =
            110 + 40 +
            25 * (Object.keys(this.inputs).length + Object.keys(this.outputs).length);
    }

    serialize() {
        return {
            name: this.controls.module.value
        };
    }
}
