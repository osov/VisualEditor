import { DictAny, DictInNode, GetNodeFnc, IInOutConfig, INode, INodeConfigData, INodeContext, IOutputData, ITaskInfo, OutNodeInfo } from "./types";

export function iNode(id_current_node: string, node_data: DictAny, outputs: IOutputData, get_node: GetNodeFnc, name: string): INode {

    const connections_data: INodeConfigData = {
        data_in: {},
        data_out: {}
    }

    const config_in_out: IInOutConfig = {
        in_actions: [], // массив входов с действиями
        in_data: [], // массив входов с данными
        out_actions: [], // массив выходов с действиями
        out_data: [] // массив выходов с данными
    }

    let task_info: ITaskInfo

    const context: INodeContext = {
        node_data,
        get_in_data,
        get_out_data,
        get_in_data_nodes,
        next_code,
        code,
    }

    function init() {
        init_connections()
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
        const { data_out } = connections_data
        // ещё нету такого гнезда, создаем выход у себя
        if (!data_out[my_out_id])
            data_out[my_out_id] = []
        data_out[my_out_id].push({ target: target_node_id, targetInput })

        // создаем вход у другой ноды
        // Здесь не используем массив т.к. проще работать, по сути инфа о входе нужна только для данных
        // а мультивход для действия мы все равно не будем обрабатывать
        target_node.connections_data.data_in[targetInput] = { source: id_current_node, sourceOutput: my_out_id }
    }


    function set_task_info(ti: ITaskInfo) {
        config_in_out.in_actions = ti.in_actions
        config_in_out.in_data = ti.in_data
        config_in_out.out_actions = ti.out_actions
        config_in_out.out_data = ti.out_data
        task_info = ti
    }

    // ищем подключенные к нам ноды c данными
    function get_in_data_nodes() {
        const inds_data = config_in_out.in_data;
        const list: DictInNode = {};
        for (let i = 0; i < inds_data.length; i++) {
            var ind = inds_data[i];
            if (!list[ind])
                (list as any)[ind] = null;
            const node = connections_data.data_in[ind];
            if (node)
                list[ind] = node;
        }
        return list;
    }

    function get_in_data(): DictAny {
        const nodes_data = get_in_data_nodes();
        const list: DictAny = {};
        for (const input_name in nodes_data) {
            var conn_info = nodes_data[input_name];
            list[input_name] = null;
            if (conn_info) {
                const conn_node = get_node(conn_info.source)
                if (conn_node != null) {
                    // вытащим все данные с неё
                    var src_data = conn_node.get_out_data()
                    const out_name = conn_info.sourceOutput
                    list[input_name] = src_data[out_name];
                }
            }
        }
        return list;
    }

    function next_code(id_out: string, level: number) {
        if (!config_in_out.out_actions.includes(id_out)) {
            error("Выход не найден:", id_out, id_current_node);
            return '';
        }
        const { data_out } = connections_data
        // выход ни к чему не подключен
        if (!data_out[id_out])
            return '';
        let code = '';
        const out_connections: OutNodeInfo[] = data_out[id_out]
        for (let i = 0; i < out_connections.length; i++) {
            const connection = out_connections[i]
            const node = get_node(connection.target)!;
            code += node.code(level) + '\n';
        }
        return code;
    }

    function get_out_data() {
        return task_info.get_out_data!(node_data, get_in_data)
    }

    function code(level = 0) {
        return add_tabs_to_text(task_info.code!(context), level);
    }

    function add_tabs_to_text(text: string, num: number) {
        const lines = text.split('\n');
        return lines.map(l => '\t'.repeat(num) + l).join('\n');
    }


    return { init, set_task_info, connections_data, get_in_data_nodes, get_in_data, get_out_data, code, config_in_out, name, node_data }
}