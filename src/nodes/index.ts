import { ClassicPreset } from 'rete'

// const
import { NumberNode } from "./constants/number"
import { StringNode } from "./constants/string"

// modules
import { ModuleNode } from "./module/module"
import { InputNode } from "./module/input"
import { InputActionNode } from "./module/input_action"
import { OutputNode } from "./module/output"
import { OutputActionNode } from "./module/output_action"

// events
import { EngineReadyNode } from './events/engineReady'

// 
import { AddNode } from "./add";
import { SequenceNode } from "./sequence"
import { SequenceNode2 } from "./sequence2"
import { LogNode } from "./log"
import { DelayNode } from "./delay"
import { AnyToNumberNode } from './converts/any_number'
import { AnyToStringNode } from './converts/any_string'



export {
    NumberNode, StringNode,
    EngineReadyNode,
    ModuleNode, InputNode, OutputNode, InputActionNode, OutputActionNode,
    AddNode, SequenceNode, SequenceNode2, LogNode, DelayNode,
    AnyToNumberNode, AnyToStringNode
}


export type Nodes = InputNode | OutputNode | InputActionNode | OutputActionNode | ModuleNode | //  modules
    EngineReadyNode | // events
    NumberNode | StringNode | // const
    AnyToNumberNode | AnyToStringNode | // converts
    AddNode | SequenceNode | SequenceNode2 | LogNode | DelayNode

export class Connection<A extends Nodes, B extends Nodes> extends ClassicPreset.Connection<A, B> { }
export type Conn = Connection<NumberNode, AddNode>