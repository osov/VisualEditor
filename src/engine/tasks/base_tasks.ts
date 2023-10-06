import { delay } from "../../utils/utils";
import { ITaskInfo } from "../types";

export const base_tasks: { [k: string]: ITaskInfo } = {
    'Input': {
        in_actions: [],
        in_data: ['m'],
        out_actions: [],
        out_data: ['m'],
        get_out_data: (_, get_in_data) => get_in_data()
    },
    'Output': {
        in_actions: [],
        in_data: ['m'],
        out_actions: [],
        out_data: ['m'],
        get_out_data: (_, get_in_data) => get_in_data()

    },
    'InputAction': {
        in_actions: ['m'],
        in_data: [],
        out_actions: ['m'],
        out_data: [],
        run: (_, __, call_action) => call_action('m')
    },
    'OutputAction': {
        in_actions: ['m'],
        in_data: [],
        out_actions: ['m'],
        out_data: [],
        run: (_, __, call_action) => call_action('m')
    },
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
    'Boolean': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: data.val }
        }
    },
    'VarSet': {
        in_actions: ['in'],
        in_data: ['data'],
        out_actions: [],
        out_data: [],
        run: async (data, get_in_data, _) => {
            const nodes_data = get_in_data();
            gameState.set_scene_var(data.n, nodes_data.data, data.g == 0);
        },
    },
    'VarGet': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: gameState.get_scene_var(data.n, data.g == 0) }
        }
    },
    'AnyToNumber': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (_, get_in_data) => {
            const nodes_data = get_in_data();
            const out = nodes_data['in'] != null ? nodes_data['in'] : 0;
            return { out };
        }
    },
    'AnyToString': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (_, get_in_data) => {
            const nodes_data = get_in_data();
            const out = nodes_data['in'] != null ? (nodes_data['in'] as string) + '' : '';
            return { out };
        }
    },
    'Add': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['sum'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { sum: A + B };
        }
    },
    'EngineReady': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        run: (_, __, call_action) => call_action('out'),
    },
    'Sequence': {
        in_actions: ['in'],
        in_data: [],
        out_actions: ['out1', 'out2', 'out3', 'out4', 'out5', 'out6', 'out7', 'out8', 'out9', 'out10'],
        out_data: [],
        run: async (data, __, call_action) => {
            const cnt: number = data.val;
            for (let i = 1; i <= cnt; i++)
                await call_action('out' + i);
        },
    },
    'Log': {
        in_actions: ['in'],
        in_data: ['data'],
        out_actions: [],
        out_data: [],
        run: (data, get_in_data, _) => {
            const nodes_data = get_in_data();
            const info_data = nodes_data['data'] != null ? nodes_data['data'] : data.val;
            log(info_data);
        },
    },
    'Delay': {
        in_actions: ['in'],
        in_data: ['ms'],
        out_actions: ['out'],
        out_data: [],
        run: async (data, get_in_data, call_action) => {
            const in_data = get_in_data();
            const ms = in_data.ms != null ? in_data.ms : data.ms;
            await delay(ms);
            await call_action('out');

        },
    },
    'FlowBlock': {
        in_actions: ['in'],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        run: async (data, __, call_action) => {
            // todo check condition
            console.log(data.id)
            await call_action('out')

        },
    },
    'FlowSet': {
        in_actions: ['in'],
        in_data: ['status'],
        out_actions: [],
        out_data: [],
        run: async (data, get_in_data, _) => {
            const nodes_data = get_in_data();
            const status = nodes_data['status'] != null ? nodes_data['status'] : data.ac;
            const id = data.id;
            gameState.set_flow_status(id, status);
        },
    },
    'FlowStatus': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: gameState.get_flow_status(data.id) }
        }
    },
}