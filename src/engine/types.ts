export type VoidCallback = () => void;
export type NumberCallback = (id: number) => void;
export type GetNodeFnc = (id: string) => INode | undefined

export type INodeGraph = { [k: string]: INode }

export interface IModuleInfo {
    inputs: DictString;
    outputs: DictString;
}

export interface GraphInfo {
    nodes: { [k: string]: INode }
    connections: IConnectionData[]
    nodes_data: INodeData[]
    module_info: IModuleInfo
}

export interface IEngine {
}

export interface INodeContext {
    id_node:string
    node_data: DictAny
    next_code(id_out: string, level: number): string
    code: (level?: number) => string
    get_in_data_nodes: () => DictInNode
    get_prev_vars: () => string
    make_var: (name: string, val: any) => string
    get_var_name: (node: string, out: string) => string
}


export type FncGetDictAny = () => DictAny

export interface ITaskInfo {
    in_actions: string[];
    in_data: string[];
    out_actions: string[];
    out_data: string[];
    code: (context:INodeContext) => string;
}

export interface INodeConfigData {
    data_in: DictInNode
    data_out: DictOutNodes
}

export interface IInOutConfig {
    in_actions: string[],
    in_data: string[],
    out_actions: string[],
    out_data: string[]
}

export interface INode {
    name: string
    node_data: DictAny
    init: (vars:{ [key: string]: boolean}) => void
    set_task_info: (task: ITaskInfo) => void
    get_in_data_nodes(): DictInNode
    code: (level: number) => string
    connections_data: INodeConfigData
    config_in_out: IInOutConfig // debug
}

export type IOutputData = { output: string, target: string, targetInput: string }[]
export type IInputData = { input: string, source: string, sourceOutput: string }[]

export interface IConnectionData {
    source: string
    sourceOutput: string
    target: string
    targetInput: string
}

export interface INodeData {
    id: string
    name: string
    x: number
    y: number
    data?: any
}

export interface JsonData {
    commnets: string[]
    connections: IConnectionData[]
    nodes: INodeData[]
}

export interface InNodeInfo {
    source: string
    sourceOutput: string
}

export interface OutNodeInfo {
    target: string
    targetInput: string
}

export type DictOutNodes = { [k: string]: OutNodeInfo[] }
export type DictInNode = { [k: string]: InNodeInfo }

export interface DictString { [k: string]: string }
export interface DictAny { [k: string]: any }
export interface DictINodes { [k: string]: INode[] }