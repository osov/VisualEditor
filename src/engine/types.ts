export type GetNodeFnc = (id: string) => INode | undefined

export type INodeGraph = { [k: string]: INode }

export interface GraphInfo {
    nodes: { [k: string]: INode }
    connections: IConnectionData[]
    nodes_data: INodeData[]
}

export interface IEngine {
}

export type FncGetDictAny = () => DictAny

export interface ITaskInfo {
    in_actions: string[];
    in_data: string[];
    out_actions: string[];
    out_data: string[];
    run?: (data: DictAny, get_in_data: FncGetDictAny, call_action: (id_out: string) => void) => void;
    get_out_data?: (data: DictAny, get_in_data: FncGetDictAny) => DictAny;
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
    init: () => void
    run: () => void
    set_task_info: (task: ITaskInfo) => void
    get_in_data_nodes(): DictInNode
    get_in_data(): DictAny
    get_out_data: () => DictAny
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

export interface DictAny { [k: string]: any }
export interface DictINodes { [k: string]: INode[] }