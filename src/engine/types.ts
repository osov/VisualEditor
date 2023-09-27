export type GetNodeFnc = (id: string) => INode | undefined

export interface IEngine {
}

export interface INode {
    init: () => void
    data_in: DictInNode
    data_out: DictOutNodes
}

export type IOutputData = { output: string, target: string, targetInput: string }[]
export type IInputData = { input: string, source: string, sourceOutput: string }[]

interface IConnectionData {
    source: string
    sourceOutput: string
    target: string
    targetInput: string
}

interface INodeData {
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
export interface DictStrings { [k: string]: string[] }
export interface DictINodes { [k: string]: INode[] }