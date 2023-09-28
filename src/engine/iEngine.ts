import { iNode } from "./iNode"
import { base_tasks } from "./tasks/base_tasks"
import { GraphInfo, IConnectionData, IInputData, INode, INodeData, INodeGraph, IOutputData, ITaskInfo, JsonData } from "./types"

export function iEngine(dc_modules: { [k: string]: string }) {

    // const all_nodes: INodeGraph = {}

    function init(str: string) {
        const graph = init_graph(str);
        (window as any).nodes = graph;
    }



    function merge_graph(nodes: INodeGraph, connections: IConnectionData[], nodes_data: INodeData[], ext: GraphInfo) {

        for (let k in ext.nodes) {
            const node = ext.nodes[k]
            nodes[k] = node
        }

        for (let i = 0; i < ext.connections.length; i++) {
            const con = ext.connections[i];
            connections.push(con)
        }

        for (let i = 0; i < ext.nodes_data.length; i++) {
            const nd = ext.nodes_data[i];
            nodes_data.push(nd)
        }


    }

    function init_graph(str: string, sub_module = false) {
        const nodes: INodeGraph = {}

        function get_node(id: string) {
            if (nodes[id])
                return nodes[id]
            console.error("Не найдена нода:", id)
        }

        const data: JsonData = JSON.parse(str)
        const nodes_data = data.nodes
        const connections = data.connections
        // сначала надо создать все модули
        const modules: { [k: string]: GraphInfo } = {}
        const modules_ids_input: { [k: string]: { [k: string]: string } } = {}
        const modules_ids_output: { [k: string]: { [k: string]: string } } = {}
        for (let i = 0; i < nodes_data.length; i++) {
            const node_data = nodes_data[i]
            if (node_data.name == 'Module') {
                modules[node_data.id] = make_module(node_data.data.name, node_data.id)
                const mi_nodes = modules[node_data.id].nodes

                const arr_in: { [k: string]: string } = {}
                const arr_out: { [k: string]: string } = {}
                for (const module_id_node in mi_nodes) {
                    const module_node = mi_nodes[module_id_node]
                    if (module_node.name == 'Input')
                        arr_in[module_node.node_data.key] = module_id_node
                    if (module_node.name == 'Output')
                        arr_out[module_node.node_data.key] = module_id_node

                }
                modules_ids_input[node_data.id] = arr_in
                modules_ids_output[node_data.id] = arr_out
                merge_graph(nodes, connections, nodes_data, modules[node_data.id])
            }
        }


        // а теперь переназначить входы у данных о соединениях
        for (let i = 0; i < connections.length; i++) {
            const cd = connections[i]
            // какая-то нода подключена к модулю
            if (modules_ids_input[cd.target]) {
                cd.target = modules_ids_input[cd.target][cd.targetInput]
                cd.targetInput = 'm'
            }
            // выход модуля подключен к ноде
            if (modules_ids_output[cd.source]) {
                cd.source = modules_ids_output[cd.source][cd.sourceOutput]
                cd.sourceOutput = 'm'
            }
        }

        const outputs: { [k: string]: IOutputData } = {}
        // информация о соединениях
        for (let i = 0; i < connections.length; i++) {
            const cd = connections[i]
            if (!outputs[cd.source])
                outputs[cd.source] = []
            outputs[cd.source].push({ output: cd.sourceOutput, target: cd.target, targetInput: cd.targetInput })
        }

        for (let i = 0; i < nodes_data.length; i++) {
            const node_data = nodes_data[i]
            if (node_data.name == 'Module') {
            }
            else {
                const node = iNode(node_data.id, node_data.data, outputs[node_data.id] || [], get_node, node_data.name)
                nodes[node_data.id] = node
                attach_task(node, node_data.name)
            }
        }

        for (const key in nodes) {
            const node = nodes[key]
            // чтобы не было задвоенного инита
            if (sub_module && (node.name == 'Output' || node.name == 'Input')) { }
            else
                node.init()
        }
        return { nodes, connections, nodes_data }
    }

    function make_module(name: string, id: string) {
        if (!dc_modules[name])
            console.error('Модуль не найден:', name)
        // нужно переназначить все входы/выходы на новые ИДы чтобы не было конфликтов
        const data: JsonData = JSON.parse(dc_modules[name])
        const nodes_data = data.nodes
        // сначала ноды
        for (let i = 0; i < nodes_data.length; i++) {
            const nd = nodes_data[i];
            nd.id = 'module_' + id + '_' + nd.id
        }
        // и соединения тоже
        const connections_data = data.connections
        for (let i = 0; i < connections_data.length; i++) {
            const cd = connections_data[i];
            cd.source = 'module_' + id + '_' + cd.source
            cd.target = 'module_' + id + '_' + cd.target
        }
        const str = JSON.stringify(data)
        const graph = init_graph(str, true)
        return graph
    }

    function attach_task(node: INode, name_node: string) {
        if (name_node in base_tasks) {
            const task_info: ITaskInfo = (base_tasks as any)[name_node]
            node.set_task_info(task_info)
        }
        else
            console.error('Задача не подключена:', name_node)
    }



    return { init }
}