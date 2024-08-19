import { ClassicPreset } from 'rete'

// events
import { EventReadyNode } from './events/event_ready'
import { OnCharClickNode } from './events/on_char_click'
import { OnSceneEventNode } from './events/on_scene_event'

// interaction
import { DialogNode } from "./interaction/dialog"
import { LoadSceneNode } from './interaction/load_scene'

// const
import { NumberNode } from "./constants/number"
import { StringNode } from "./constants/string"
import { ColorNode } from "./constants/color"
import { BooleanNode } from "./constants/boolean"

// operators
import { IfElseNode } from './flow/if_else'
import { SequenceNode } from "./flow/sequence"
import { FlowBlockNode } from "./flow/flow_block"
import { FlowSetNode } from "./flow/flow_set"
import { FlowStatusNode } from './flow/flow_status'
import { LogNode } from "./flow/log"
import { DelayNode } from "./flow/delay"
import { InOutNode } from "./flow/in_out"

// converts
import { AnyToCustomNode } from './converts/any_to_custom'
import { ConcatStrNode } from './converts/concat_str'

//  math
import { MathNode } from './math/math_node'
import { InvertNumberNode } from './math/invert_number'
import { RandomNode } from './math/random'

// bool math
import { BoolMathNode } from './math_bool/bool_math_node'
import { InvertBoolNode } from './math_bool/invert_bool'

// modules
import { ModuleNode } from "./module/module"
import { InputNode } from "./module/input"
import { InputActionNode } from "./module/input_action"
import { OutputNode } from "./module/output"
import { OutputActionNode } from "./module/output_action"

// vars
import { VarSetNode } from './variables/var_set'
import { VarGetNode } from './variables/var_get'

// custom
import { InActionNode } from './custom/in_action_node'
import { EmptyNode } from './custom/empty_node'

export {
    NumberNode, StringNode, ColorNode, BooleanNode,
    EventReadyNode, OnCharClickNode, OnSceneEventNode,
    LoadSceneNode,
    ModuleNode, InputNode, OutputNode, InputActionNode, OutputActionNode,
    MathNode, InvertNumberNode, BoolMathNode, RandomNode, InvertBoolNode,
    SequenceNode, IfElseNode, LogNode, DelayNode, DialogNode, FlowBlockNode, FlowSetNode, FlowStatusNode, InOutNode,
    AnyToCustomNode, ConcatStrNode,
    VarSetNode, VarGetNode,
    InActionNode, EmptyNode
}


export type Nodes = InputNode | OutputNode | InputActionNode | OutputActionNode | ModuleNode | //  modules
    EventReadyNode | OnCharClickNode | OnSceneEventNode |// events
    DialogNode | LoadSceneNode | // interaction
    NumberNode | StringNode | ColorNode | BooleanNode | // const
    AnyToCustomNode | ConcatStrNode | // converts
    MathNode | InvertNumberNode | RandomNode | // math
    BoolMathNode | InvertBoolNode | // bool math
    SequenceNode | LogNode | DelayNode | FlowBlockNode | FlowSetNode | FlowStatusNode | InOutNode | // flow
    VarSetNode | VarGetNode | // vars
    InActionNode | EmptyNode

export class Connection<A extends Nodes, B extends Nodes> extends ClassicPreset.Connection<A, B> { }
export type Conn = Connection<NumberNode, NumberNode>