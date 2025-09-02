import { ITaskInfo } from "../types";

export const game_tasks: { [k: string]: ITaskInfo } = {
    'OnQuestReady': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => `register_event_on_quest_ready( async() => {\n` + context.next_code('out', 1) + `});`
    },
    'OnRegionEnter': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => `register_event_on_reginon_enter('${context.node_data.id}', async() => {\n` + context.next_code('out', 1) + `});`
    },
    'OnRegionLeave': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => `register_event_on_reginon_leave('${context.node_data.id}', async() => {\n` + context.next_code('out', 1) + `});`
    },
    'OnInteractNPC': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => `register_event_on_interact_npc('${context.node_data.id}', async() => {\n` + context.next_code('out', 1) + `});`
    },
    'StageEvent': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => `register_event_stage(${context.node_data.id}, async() => {\n` + context.next_code('out', 1) + `});`
    },
    'StageGet': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        code(context) {
            let code = context.get_prev_vars();
            code += context.make_var(context.get_var_name(context.id_node, 'out'), `await get_current_stage();`);
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
            code += `await set_current_stage(${id});`
            return code;
        }
    },
    'CloseDialog': {
        in_actions: ['in'],
        in_data: [],
        out_actions: [],
        out_data: [],
        code: () => 'close_dialog();'
    },
    'Dialog': {
        in_actions: ['in'],
        in_data: ['in0', 'in1', 'in2', 'in3', 'in4',],
        out_actions: ['out0', 'out1', 'out2', 'out3', 'out4'],
        out_data: [],
        code(context) {
            let code = context.get_prev_vars();
            const data = context.node_data;
            const user = data.index;
            const text = data.text;
            const tmp_answers = data.answers as string[];
            const answers = [];
            const in_data = context.get_in_data_nodes();
            for (let i = 0; i < tmp_answers.length; i++) {
                let answer = tmp_answers[i];
                if (answer != '')
                    answers.push({ id: i, answer });

                // если это ответ с переменными
                // если что-то есть во входе
                if (in_data['in' + i] != null) {
                    const id = context.get_var_name(in_data['in' + i].source, in_data['in' + i].sourceOutput);
                    answer = id;
                    if (answer != '')
                        answers.push({ id: i, answer });
                }
            }
            code += `open_dialog('${user}', \`${text.trim()}\`, ${JSON.stringify(answers)}, async (id) => {\n`;
            const tab = '\t';
            for (let i = 0; i < answers.length; i++) {
                const it = answers[i];
                code += tab + `if (id == ${it.id}) {\n`;
                code += context.next_code('out' + it.id, 2);
                code += tab + `}\n`;
            }
            code += `});\n`;
            return code;
        },
    }

}