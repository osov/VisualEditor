import { ClassicPreset } from 'rete'

// const
import { NumberNode } from "./constants/number"
import { StringNode } from "./constants/string"
import { ColorNode } from "./constants/color"
import { BooleanNode } from "./constants/boolean"

// modules
import { ModuleNode } from "./module/module"
import { InputNode } from "./module/input"
import { InputActionNode } from "./module/input_action"
import { OutputNode } from "./module/output"
import { OutputActionNode } from "./module/output_action"

// events
import { EngineReadyNode } from './events/engineReady'

// 
import { AddNode } from "./math/add";
import { SequenceNode } from "./flow/sequence"
import { FlowBlockNode } from "./flow/flowBlock"
import { FlowSetNode } from "./flow/flowSet"
import { DialogNode } from "./dialog"
import { LogNode } from "./log"
import { DelayNode } from "./flow/delay"
import { AnyToNumberNode } from './converts/any_number'
import { AnyToStringNode } from './converts/any_string'
import { FlowStatusNode } from './flow/flowStatus'
import { VarSetNode } from './varSet'
import { VarGetNode } from './varGet'



export {
    NumberNode, StringNode, ColorNode, BooleanNode,
    EngineReadyNode,
    ModuleNode, InputNode, OutputNode, InputActionNode, OutputActionNode,
    AddNode,
    SequenceNode, LogNode, DelayNode, DialogNode, FlowBlockNode, FlowSetNode, FlowStatusNode,
    AnyToNumberNode, AnyToStringNode,
    VarSetNode, VarGetNode
}


export type Nodes = InputNode | OutputNode | InputActionNode | OutputActionNode | ModuleNode | //  modules
    EngineReadyNode | // events
    NumberNode | StringNode | ColorNode | BooleanNode | // const
    AnyToNumberNode | AnyToStringNode | // converts
    AddNode | SequenceNode | LogNode | DelayNode | DialogNode
    | FlowBlockNode | FlowSetNode | FlowStatusNode |
    VarSetNode | VarGetNode

export class Connection<A extends Nodes, B extends Nodes> extends ClassicPreset.Connection<A, B> { }
export type Conn = Connection<NumberNode, AddNode>