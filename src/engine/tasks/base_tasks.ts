import { ITaskInfo } from "../types";

export const base_tasks: { [k: string]: ITaskInfo } = {
    // in/out
    'Input': {
        in_actions: [],
        in_data: ['m'],
        out_actions: [],
        out_data: ['m'],
        get_out_data: (context) => context.get_in_data(),
    },
    'Output': {
        in_actions: [],
        in_data: ['m'],
        out_actions: [],
        out_data: ['m'],
        get_out_data: (context) => context.get_in_data(),

    },
    'InputAction': {
        in_actions: ['m'],
        in_data: [],
        out_actions: ['m'],
        out_data: [],
        code: (context) => context.next_code('m', 0)
    },
    'OutputAction': {
        in_actions: ['m'],
        in_data: [],
        out_actions: ['m'],
        out_data: [],
        code: (context) => context.next_code('m', 0)
    },
    // constants
    'Number': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['int'],
        code: (context) => context.make_var(context.get_var_name(context.id_node, 'int'), context.node_data.val)
    },
    'String': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['str'],
        code: (context) => context.make_var(context.get_var_name(context.id_node, 'str'), context.node_data.val)
    },
    'Boolean': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['bol'],
        code: (context) => context.make_var(context.get_var_name(context.id_node, 'bol'), context.node_data.val)
    },
    'Color': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['clr'],
        code: (context) => context.make_var(context.get_var_name(context.id_node, 'clr'), context.node_data.val)
    },
    // operators
    'Log': {
        in_actions: ['in'],
        in_data: ['data'],
        out_actions: [],
        out_data: [],
        code: (context) => {
            var code = context.get_prev_vars();
            let text = `'${context.node_data.val}'`;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['data'] != null)
                text = context.get_var_name(nodes_data['data'].source, nodes_data['data'].sourceOutput);
            return code + `console.log(${text});`;
        }
    },
    'InOut': {
        in_actions: ['in'],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code: (context) => context.next_code('out', 1)
    },
    'IfElse': {
        in_actions: ['in'],
        in_data: ['con'],
        out_actions: ['then', 'else'],
        out_data: [],
        code(context) {
            let code = context.get_prev_vars();
            const nodes_data = context.get_in_data_nodes();
            let cond = 'false';
            if (nodes_data['con'])
                cond = context.get_var_name(nodes_data['con'].source, nodes_data['con'].sourceOutput);
            code += "if (" + cond + "){\n";
            code += context.next_code('then', 1);
            code += "}";
            code += "else{\n";
            code += context.next_code('else', 1);
            code += "}";
            return code;
        },
    },
    'Sequence': {
        in_actions: ['in'],
        in_data: [],
        out_actions: ['out0', 'out1', 'out2', 'out3', 'out4', 'out5', 'out6', 'out7', 'out8', 'out9',],
        out_data: [],
        code(context) {
            const cnt: number = context.node_data.val;
            let code = context.get_prev_vars();
            for (let i = 0; i < cnt; i++)
                code += context.next_code('out' + i, 0);
            return code;
        }
    },
    'Delay': {
        in_actions: ['in'],
        in_data: ['ms'],
        out_actions: ['out'],
        out_data: [],
        code(context) {
            let code = context.get_prev_vars();
            const nodes_data = context.get_in_data_nodes();
            let ms = context.node_data.ms;
            if (nodes_data['ms'])
                ms = context.get_var_name(nodes_data['ms'].source, nodes_data['ms'].sourceOutput);
            code += `await delay(${ms});\n`;
            code += context.next_code('out', 0);
            return code;
        }
    },
    // converts
    'AnyToNumber': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        code(context) {
            let code = context.get_prev_vars();
            const nodes_data = context.get_in_data_nodes();
            let in_name = '0';
            if (nodes_data['in'] != null)
                in_name = context.get_var_name(nodes_data['in'].source, nodes_data['in'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'out'), `parseInt(${in_name})`);
            return code;
        }
    },
    'AnyToString': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        code(context) {
            let code = context.get_prev_vars();
            const nodes_data = context.get_in_data_nodes();
            let in_name = '0';
            if (nodes_data['in'] != null)
                in_name = context.get_var_name(nodes_data['in'].source, nodes_data['in'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'out'), `String(${in_name})`);
            return code;
        }
    },
    'AnyToBoolean': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        code(context) {
            let code = context.get_prev_vars();
            const nodes_data = context.get_in_data_nodes();
            let in_name = '0';
            if (nodes_data['in'] != null)
                in_name = context.get_var_name(nodes_data['in'].source, nodes_data['in'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'out'), `(${in_name} == 1 || ${in_name} == 'true' || ${in_name} == true)`);
            return code;
        }
    },
    'AnyToColor': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        code(context) {
            let code = context.get_prev_vars();
            const nodes_data = context.get_in_data_nodes();
            let in_name = '0';
            if (nodes_data['in'] != null)
                in_name = context.get_var_name(nodes_data['in'].source, nodes_data['in'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'out'), `(${in_name}).length > 0 ? ${in_name} : '#000000'`);
            return code;
        }
    },
    'ConcatStr': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            let code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), `String(${A}) + String(${B})`);
            return code;
        }
    },
    // math
    'Add': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            let code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), A + " + " + B);
            return code;
        }
    },
    'Sub': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), A + " - " + B);
            return code;
        }
    },
    'Mul': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), A + " * " + B);
            return code;
        }
    },
    'Div': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), A + " / " + B);
            return code;
        }
    },
    'InvNumber': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        code(context) {
            let code = context.get_prev_vars();
            const nodes_data = context.get_in_data_nodes();
            let in_name = '0';
            if (nodes_data['in'] != null)
                in_name = context.get_var_name(nodes_data['in'].source, nodes_data['in'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'out'), `-1 * ${in_name}`);
            return code;
        }
    },
    'RandInt': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), `random_int({${A}, ${B}})`);
            return code;
        }
    },
    'RandFloat': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), `random_float({${A}, ${B}})`);
            return code;
        }
    },
    // bool math
    '!': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        code(context) {
            let code = context.get_prev_vars();
            const nodes_data = context.get_in_data_nodes();
            let in_name = '0';
            if (nodes_data['in'] != null)
                in_name = context.get_var_name(nodes_data['in'].source, nodes_data['in'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'out'), `!${in_name}`);
            return code;
        }
    },
    '>': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), `${A} > ${B}`);
            return code;
        }
    },
    '>=': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), `${A} >= ${B}`);
            return code;
        }
    },
    '<': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), `${A} < ${B}`);
            return code;
        }
    },
    '<=': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), `${A} <= ${B}`);
            return code;
        }
    },
    '=': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        code: (context) => {
            var code = context.get_prev_vars();
            const data = context.node_data;
            let A = data.A;
            let B = data.B;
            const nodes_data = context.get_in_data_nodes();
            if (nodes_data['A'] != null)
                A = context.get_var_name(nodes_data['A'].source, nodes_data['A'].sourceOutput);
            if (nodes_data['B'] != null)
                B = context.get_var_name(nodes_data['B'].source, nodes_data['B'].sourceOutput);
            code += context.make_var(context.get_var_name(context.id_node, 'val'), `${A} == ${B}`);
            return code;
        }
    },
    // vars
    'VarSet': {
        in_actions: ['in'],
        in_data: ['data'],
        out_actions: [],
        out_data: [],
        code: (context) => {
            let code = context.get_prev_vars();
            const data = context.node_data;
            const nodes_data = context.get_in_data_nodes();
            let val = data.v;
            if (nodes_data['data'] != null)
                val = context.get_var_name(nodes_data['data'].source, nodes_data['data'].sourceOutput);
            code += `await gameState.set_scene_var('${data.n}', ${val}, ${data.g == 0});`
            return code;
        }
    },
    'VarGet': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        code(context) {
            let code = context.get_prev_vars();
            const data = context.node_data;
            code += context.make_var(context.get_var_name(context.id_node, 'out'), `await gameState.get_scene_var('${data.n}', ${data.g == 0})`);
            return code;
        }
    },
    'EmptyNode': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: [],
    }
}