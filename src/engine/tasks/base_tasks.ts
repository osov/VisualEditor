import { ITaskInfo } from "../types";

export const base_tasks: { [k: string]: ITaskInfo } = {
    'Number': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: data.val }
        }
    },
    'String': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: data.val }
        }
    },
    'Add': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['sum'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data()
            const A = nodes_data['A'] != null ? nodes_data['A'] : data.A
            const B = nodes_data['B'] != null ? nodes_data['B'] : data.B
            return { sum: A + B }
        }
    },
    'EngineReady': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        run: (_, __, call_action) => { call_action('out') },
    },
    'Sequence': {
        in_actions: ['in'],
        in_data: [],
        out_actions: ['out1', 'out2', 'out3', 'out4', 'out5', 'out6', 'out7', 'out8', 'out9', 'out10'],
        out_data: [],
        run: (data, __, call_action) => {
            const cnt: number = data.val
            for (let i = 1; i <= cnt; i++)
                call_action('out' + i)
        },
    },
    'Log': {
        in_actions: ['in'],
        in_data: ['data'],
        out_actions: [],
        out_data: [],
        run: (data, get_in_data, _) => {
            const nodes_data = get_in_data()
            const info_data = nodes_data['data'] != null ? nodes_data['data'] : data.val;
            console.log(info_data)
        },
    }
}