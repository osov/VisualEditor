import { iNode } from "./iNode"
import { base_tasks } from "./tasks/base_tasks"
import { IInputData, INode, IOutputData, ITaskInfo, JsonData } from "./types"

export function iEngine() {
    const nodes: { [k: string]: INode } = {}

    function init(str: string) {
        const data: JsonData = JSON.parse(str)
        const nodes_data = data.nodes

        const outputs: { [k: string]: IOutputData } = {}
        const inputs: { [k: string]: IInputData } = {}

        // информация о соединениях
        for (let i = 0; i < data.connections.length; i++) {
            const cd = data.connections[i]
            if (!outputs[cd.source])
                outputs[cd.source] = []
            outputs[cd.source].push({ output: cd.sourceOutput, target: cd.target, targetInput: cd.targetInput })

            if (!inputs[cd.target])
                inputs[cd.target] = []
            inputs[cd.target].push({ input: cd.targetInput, source: cd.source, sourceOutput: cd.sourceOutput })
        }

        for (let i = 0; i < nodes_data.length; i++) {
            const node_data = nodes_data[i]
            const node = iNode(node_data.id, node_data.data, outputs[node_data.id] || [], get_node)
            nodes[node_data.id] = node
            attach_task(node, node_data.name)
        }

        for (const key in nodes) {
            const node = nodes[key]
            node.init()
        }
        (window as any).nodes = nodes
    }

    function attach_task(node: INode, name_node: string) {
        if (name_node in base_tasks) {
            const task_info: ITaskInfo = (base_tasks as any)[name_node]
            node.set_task_info(task_info)
        }
        else
            console.error('Задача не подключена:', name_node)
    }

    function get_node(id: string) {
        if (nodes[id])
            return nodes[id]
        console.error("Не найдена нода:", id)
    }

    return { init, get_node }
}