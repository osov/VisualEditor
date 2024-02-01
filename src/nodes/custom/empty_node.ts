import { ClassicPreset as Classic } from "rete"
import { TextareaControl } from "../../controls";

export class EmptyNode extends Classic.Node {
    width = 190
    height = 170
    nodeTitle = { ru: "", type: "red" };
    data: any

    constructor(node_title: string, data?: any) {
        super('EmptyNode');
        this.nodeTitle.ru = node_title;
        this.data = data;
        this.addControl("Textarea", new TextareaControl('Нода не найдена:\n' + node_title + '\n\nДанные:' + JSON.stringify(data), (e) => { }));
    }

    serialize() {
        return {
            id: this.nodeTitle.ru,
            data: this.data
        }
    }
}
