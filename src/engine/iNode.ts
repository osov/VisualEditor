import { iTaskBase } from "./itaskBase";
import { DictAny, DictInNode, DictOutNodes, GetNodeFnc, IEngine, IInputData, INode, IOutputData } from "./types";



export function iNode(name_node: string, id_current_node: string, outputs: IOutputData, data_node: DictAny, get_node: GetNodeFnc): INode {
    const data_in: DictInNode = {}
    const data_out: DictOutNodes = {}
    let task_base: ReturnType<typeof iTaskBase>

    function init() {
        init_connections()
        init_task()
    }

    function init_connections() {
        for (let i = 0; i < outputs.length; i++) {
            const connection = outputs[i]
            connect_to(connection.output, connection.target, connection.targetInput)
        }
    }

    function connect_to(my_out_id: string, target_node_id: string, targetInput: string) {
        const target_node = get_node(target_node_id)
        if (!target_node)
            return
        // ещё нету такого гнезда, создаем выход у себя
        if (!data_out[my_out_id])
            data_out[my_out_id] = []
        data_out[my_out_id].push({ target: target_node_id, targetInput })

        // создаем вход у другой ноды
        // Здесь не используем массив т.к. проще работать, по сути инфа о входе нужна только для данных
        // а мультивход для действия мы все равно не будем обрабатывать
        target_node.data_in[targetInput] = { source: id_current_node, sourceOutput: my_out_id }
    }

    function init_task() {
        task_base = iTaskBase(name_node, id_current_node, data_node, get_node)
        let is_init = false
    }


    return { init, data_out, data_in }
}