import { ITaskInfo } from "../types";

export const game_tasks: { [k: string]: ITaskInfo } = {
    'OnQuestReady': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => `gameState.register_event_on_engine_ready(async() => {\n` + context.next_code('out', 1) + `});`
    },
    'OnRegionEnter': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => {
            const data = context.node_data;
            return `gameState.register_event_on_reginon_enter('${data.id}',(async() => {\n` + context.next_code('out', 1) + `}));`
        }
    },
    'OnRegionLeave': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => {
            const data = context.node_data;
            return `gameState.register_event_on_reginon_leave('${data.id}',(async() => {\n` + context.next_code('out', 1) + `}));`
        }
    },
    'OnInteractNPC': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => {
            const data = context.node_data;
            return `gameState.register_event_on_interact_npc('${data.id}',(async() => {\n` + context.next_code('out', 1) + `}));`
        }
    },
    'StageGet': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        code(context) {
            let code = context.get_prev_vars();
            code += context.make_var(context.get_var_name(context.id_node, 'out'), `await get_current_stage()`);
            return code;
        }
    },
    'StageSet': {
        in_actions: ['in'],
        in_data: ['id'],
        out_actions: [],
        out_data: [],
        code: (context) => {
            let code = context.get_prev_vars();
            const data = context.node_data;
            const nodes_data = context.get_in_data_nodes();
            let id = data.id;
            if (nodes_data['id'] != null)
                id = context.get_var_name(nodes_data['id'].source, nodes_data['id'].sourceOutput);
            code += `await set_stage(${id});`
            return code;
        }
    },
    'CloseDialog': {
        in_actions: ['in'],
        in_data: [],
        out_actions: [],
        out_data: [],
        code: () => {
            return '';
        },
    },
    'Dialog': {
        in_actions: ['in'],
        in_data: ['in_text', 'in0', 'in1', 'in2', 'in3', 'in4',],
        out_actions: ['out0', 'out1', 'out2', 'out3', 'out4'],
        out_data: [],
        code(context) {
            return '';
        },
    },



}