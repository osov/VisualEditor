import { ITaskInfo } from "../types";

export const base_tasks: { [k: string]: ITaskInfo } = {
    // in/out
    'Input': {
        in_actions: [],
        in_data: ['m'],
        out_actions: [],
        out_data: ['m'],
        get_out_data: (_, get_in_data) => get_in_data(),
     },
    'Output': {
        in_actions: [],
        in_data: ['m'],
        out_actions: [],
        out_data: ['m'],
        get_out_data: (_, get_in_data) => get_in_data(),

    },
    'InputAction': {
        in_actions: ['m'],
        in_data: [],
        out_actions: ['m'],
        out_data: [],
        code(context) {
            return '';
        },
    },
    'OutputAction': {
        in_actions: ['m'],
        in_data: [],
        out_actions: ['m'],
        out_data: [],
        code(context) {
            return '';
        },
    },
    'OnEngineReady': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code(context) {
            return `gameState.register_event_on_engine_ready(async() => {\n` + context.next_code('out', 1) + `});`
        }
    },
    'Log': {
        in_actions: ['in'],
        in_data: ['data'],
        out_actions: [],
        out_data: [],
        code: (context) => {
            let text = `'${context.node_data.val}'`;
            const nodes_data = context.get_in_data();
            if (nodes_data['data'] != null)
                text = nodes_data['data'];
            return `console.log(${text});`;
        }
    },
    // constants
    'Number': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: data.val }
        },
    },
    'String': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: `'${data.val}'` }
        },
    },
    'Boolean': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: data.val }
        },
    },
    'Color': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: `${data.val}` }
        }
    },
    // operators
    'InOut': {
        in_actions: ['in'],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code(context) {
            return context.next_code('out', 1);
        },
    },
    'IfElse': {
        in_actions: ['in'],
        in_data: ['con'],
        out_actions: ['then', 'else'],
        out_data: [],
        code(context) {
            const nodes_data = context.get_in_data();
            const cond = nodes_data['con'] != null ? nodes_data['con'] : false;
            let code = ``;
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
            let code = '';
            for (let i = 0; i < cnt; i++)
                code += context.next_code('out' + i, 0);
            return code
        }
    },
    'FlowBlock': {
        in_actions: ['in'],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        code(context) {
            return `if (gameState.get_flow_status('${context.node_data.id}')){\n
                ${context.next_code('out', 1)}
            }`;
        }
    },
    'FlowSet': {
        in_actions: ['in'],
        in_data: ['status'],
        out_actions: [],
        out_data: [],
        code(context) {
            const id = context.node_data.id;
            const nodes_data = context.get_in_data();
            const status = nodes_data['status'] != null ? nodes_data['status'] : context.node_data.ac;
            return `gameState.set_flow_status('${id}', ${status});`;
        }
    },
    'FlowStatus': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: `gameState.get_flow_status('${data.id}')` }
        }
    },
    'Delay': {
        in_actions: ['in'],
        in_data: ['ms'],
        out_actions: ['out'],
        out_data: [],
        code(context) {
            const nodes_data = context.get_in_data();
            const ms = nodes_data['ms'] != null ? nodes_data['ms'] : context.node_data.ms;
            return `await delay(${ms});`;
        }
    },


    // converts
    'AnyToNumber': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (_, get_in_data) => {
            const nodes_data = get_in_data();
            const out = nodes_data['in'] != null ? nodes_data['in'] : 0;
            return { out: `parseInt(${out})` };
        }
    },
    'AnyToString': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (_, get_in_data) => {
            const nodes_data = get_in_data();
            const out = nodes_data['in'] != null ? nodes_data['in'] : '';
            return { out: `(${out}+'')` };
        }
    },
    'AnyToBoolean': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (_, get_in_data) => {
            const nodes_data = get_in_data();
            const node = nodes_data['in'];
            return { out:`(${node} == 1 || ${node} == 'true' || ${node} == true)` };
        }
    },
    'AnyToColor': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (_, get_in_data) => {
            const nodes_data = get_in_data();
            const out = nodes_data['in'] != null && (nodes_data['in'] as string).length > 0 ? nodes_data['in'] : '#000000';
            return { out };
        }
    },
    'ConcatStr': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: string = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: string = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `${A} + ${B}` }; 
        }
    },
    // math
    'Add': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `${A} + ${B}` };
        },
    },
    'Sub': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `${A} - ${B}` };
        }
    },
    'Mul': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `${A} * ${B}` };
        }
    },
    'Div': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `${A} / ${B}` };
        }
    },
    'InvNumber': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (_, get_in_data) => {
            const nodes_data = get_in_data();
            const out = nodes_data['in'] != null ? (nodes_data['in'] as number) : 0;
            return { out: `(-1 * ${out})` };
        }
    },
    'RandInt': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `math.random({${A}, ${B}})` };
        }
    },
    'RandFloat': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            const precision = 1000;
            return { val: `math.random( ${A} * ${precision}, ${B} * ${precision}) / ${precision}` };
        }
    },
    // bool math
    '!': {
        in_actions: [],
        in_data: ['in'],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (_, get_in_data) => {
            const nodes_data = get_in_data();
            return { out:`!${nodes_data['in']}` };
        }
    },
    '>': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `(${A} > ${B})` };
        }
    },
    '>=': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `(${A} >= ${B})` };
        }
    },
    '<': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `(${A} < ${B})` };
        }
    },
    '<=': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `(${A} <= ${B})` };
        }
    },
    '=': {
        in_actions: [],
        in_data: ['A', 'B'],
        out_actions: [],
        out_data: ['val'],
        get_out_data: (data, get_in_data) => {
            const nodes_data = get_in_data();
            const A: number = nodes_data['A'] != null ? nodes_data['A'] : data.A;
            const B: number = nodes_data['B'] != null ? nodes_data['B'] : data.B;
            return { val: `(${A} == ${B})` };
        }
    },
    // vars
    'VarSet': {
        in_actions: ['in'],
        in_data: ['data'],
        out_actions: [],
        out_data: [],
        code: (context) => {
            const data = context.node_data;
            const in_data = context.get_in_data();
            const val = in_data.data != null ? in_data.data : data.v;
            return `await gameState.set_scene_var('${data.n}', ${val}, ${data.g == 0});`
        }
    },
    'VarGet': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: ['out'],
        get_out_data: (data, _) => {
            return { out: `(await gameState.get_scene_var('${data.n}', ${data.g == 0}))` };
        }
    },
    'EmptyNode': {
        in_actions: [],
        in_data: [],
        out_actions: [],
        out_data: [],
    }
}