import { DictAny, DictINodes, DictInNode, GetNodeFnc, INode, InNodeInfo } from "./types";

export function iTaskBase(name: string, id_cur_node: string, data: DictAny, get_node: GetNodeFnc) {

    const cur_node = get_node(id_cur_node)!

    const config_in_out = {
        in_actions: [], // массив входов с действиями
        in_data: ['data'], // массив входов с данными
        out_actions: [], // массив выходов с действиями
        out_data: [] // массив выходов с данными
    }

    //function init() { }
    //function get_out_data() { return [true] }
    //function run(){}

    // ищем подключенные к нам ноды c данными
    function get_in_data_nodes() {
        const inds_data = config_in_out.in_data;
        const list: DictInNode = {};
        for (let i = 0; i < inds_data.length; i++) {
            var ind = inds_data[i];
            if (!list[ind])
                (list as any)[ind] = null;
            const node = cur_node.data_in[ind];
            if (node)
                list[ind] = node;
        }
        return list;
    }

    function get_in_data() {
        // const nodes = get_in_data_nodes();
        // const list = {};
        // for (const input_name in nodes) {
        //     list[input_name] = null;
        //     var node = nodes[input_name];
        //     if (node) {
        //         // вытащим все данные с неё
        //         var src_data = node.task.getOutData();
        //         // а теперь берем только те пины которые подключенны от других нод
        //         for (var in_name in node.data_inputs) {
        //             var input = cur_node.data_inputs[in_name];
        //             if (input != undefined) {
        //                 if (input.node == node.id && node.task.out_data.indexOf(input.output) > -1) {
        //                     list[in_name] = src_data[input.output];
        //                 }
        //             }
        //         }
        //     }
        // }
        // return list;
    }

    return { config_in_out, get_in_data_nodes, get_in_data }

}