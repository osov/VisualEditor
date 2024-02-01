import { iNode } from "./iNode"
import { base_tasks } from "./tasks/base_tasks"
import { game_tasks } from "./tasks/game_tasks"
import { DictString, GraphInfo, IConnectionData, INode, INodeData, INodeGraph, IOutputData, ITaskInfo, JsonData } from "./types"

export function iEngine() {
    let dc_modules: DictString = {}

    function set_dc_modules(dc: DictString) {
        dc_modules = dc
    }

    function init(str: string) {
        const graph = init_graph(str);
        (window as any).graph = graph; // todo debug
    }

    function merge_graph(connections: IConnectionData[], nodes_data: INodeData[], ext: GraphInfo) {
        for (let i = 0; i < ext.connections.length; i++) {
            const con = ext.connections[i]
            connections.push(con)
        }

        for (let i = 0; i < ext.nodes_data.length; i++) {
            const nd = ext.nodes_data[i]
            nodes_data.push(nd)
        }
    }

    function get_module_connections(nodes_data: INodeData[]) {
        const arr_in: DictString = {}
        const arr_out: DictString = {}
        // перебираем все ноды модуля и ищем входы/выходы
        // помечаем для каждой ноды:ключ=имя_входа, значение=ид_ноды
        for (let i = 0; i < nodes_data.length; i++) {
            const node = nodes_data[i];
            if (node.name == 'Input' || node.name == 'InputAction')
                arr_in[node.data.key] = node.id
            if (node.name == 'Output' || node.name == 'OutputAction')
                arr_out[node.data.key] = node.id
        }
        return { inputs: arr_in, outputs: arr_out }
    }


    /* 
        в дочерних модулях возвращаем исходную инфу nodes_data, connections + рассчетные данные о соединениях в модуле,
        чтобы на верхушке по этим соединениям переназначить входы и выходы
    */
    function init_graph(str: string, sub_module = false) {
        const nodes: INodeGraph = {}

        function get_node(id: string) {
            if (nodes[id])
                return nodes[id]
            error("Не найдена нода:", id)
        }

        const data: JsonData = json.decode(str)
        const nodes_data = data.nodes
        const connections = data.connections
        const module_info = get_module_connections(nodes_data)

        // объединение модулей делаем на верхушке
        // а также переназначение соединений
        if (!sub_module) {
            // сначала надо создать все модули и сохранить данные о замененных входах на реальные подключения
            const modules_ids_input: { [k: string]: DictString } = {}
            const modules_ids_output: { [k: string]: DictString } = {}

            for (let i = 0; i < nodes_data.length; i++) {
                const node_data = nodes_data[i]
                // по идее на верхуше модулей будут раскиданы под-модули, которые мы проинитим и объединим
                if (node_data.name == 'Module') {
                    const module = make_module(node_data.data.name, node_data.id)
                    modules_ids_input[node_data.id] = module.module_info.inputs
                    modules_ids_output[node_data.id] = module.module_info.outputs
                    merge_graph(connections, nodes_data, module)
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

            // информация о соединениях
            const outputs: { [k: string]: IOutputData } = {}
            for (let i = 0; i < connections.length; i++) {
                const cd = connections[i]
                if (!outputs[cd.source])
                    outputs[cd.source] = []
                outputs[cd.source].push({ output: cd.sourceOutput, target: cd.target, targetInput: cd.targetInput })
            }

            for (let i = 0; i < nodes_data.length; i++) {
                const node_data = nodes_data[i]
                if (node_data.name != 'Module') {
                    const node = iNode(node_data.id, node_data.data, outputs[node_data.id] || [], get_node, node_data.name)
                    nodes[node_data.id] = node
                }
            }

            for (const key in nodes) {
                const node = nodes[key]
                attach_task(node, node.name)
                node.init()
            }
        }
        return { nodes, connections, nodes_data, module_info }
    }

    function make_module(name: string, id: string) {
        if (!dc_modules[name])
            error('Модуль не найден:', name)
        // нужно переназначить все входы/выходы на новые ИДы чтобы не было конфликтов
        const data: JsonData = json.decode(dc_modules[name])
        // сначала ноды
        const nodes_data = data.nodes
        for (let i = 0; i < nodes_data.length; i++) {
            const nd = nodes_data[i];
            nd.id = id + '_' + 'module_' + nd.id
        }
        // и соединения тоже
        const connections_data = data.connections
        for (let i = 0; i < connections_data.length; i++) {
            const cd = connections_data[i];
            cd.source = id + '_' + 'module_' + cd.source
            cd.target = id + '_' + 'module_' + cd.target
        }
        const str = json.encode(data)
        return init_graph(str, true)
    }

    function attach_task(node: INode, name_node: string) {
        if (name_node in base_tasks) {
            const task_info: ITaskInfo = (base_tasks as any)[name_node]
            node.set_task_info(task_info)
        }
        else if (name_node in game_tasks) {
            const task_info: ITaskInfo = (game_tasks as any)[name_node]
            node.set_task_info(task_info)
        }
        else
            error('Задача не подключена:', name_node)
    }



    return { init, set_dc_modules }
}