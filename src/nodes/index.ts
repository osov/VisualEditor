import { ClassicPreset } from 'rete'

// events
import { EngineReadyNode } from './events/engineReady'
import { SceneReadyNode } from './events/sceneReady'
import { OnCharClickNode } from './events/onCharClick'

// interaction
import { DialogNode } from "./interaction/dialog"
import { LoadSceneNode } from './interaction/loadScene'

// const
import { NumberNode } from "./constants/number"
import { StringNode } from "./constants/string"
import { ColorNode } from "./constants/color"
import { BooleanNode } from "./constants/boolean"

// operators
import { SequenceNode } from "./flow/sequence"
import { FlowBlockNode } from "./flow/flowBlock"
import { FlowSetNode } from "./flow/flowSet"
import { FlowStatusNode } from './flow/flowStatus'
import { LogNode } from "./operators/log"
import { DelayNode } from "./flow/delay"

// converts
import { AnyToNumberNode } from './converts/any_number'
import { AnyToStringNode } from './converts/any_string'
import { AnyToBooleanNode } from './converts/any_boolean'
import { AnyToColorNode } from './converts/any_to_color'
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
import { VarSetNode } from './operators/varSet'
import { VarGetNode } from './operators/varGet'


export {
    NumberNode, StringNode, ColorNode, BooleanNode,
    EngineReadyNode, SceneReadyNode, OnCharClickNode,
    LoadSceneNode,
    ModuleNode, InputNode, OutputNode, InputActionNode, OutputActionNode,
    MathNode, InvertNumberNode, BoolMathNode, RandomNode, InvertBoolNode,
    SequenceNode, LogNode, DelayNode, DialogNode, FlowBlockNode, FlowSetNode, FlowStatusNode,
    AnyToNumberNode, AnyToStringNode, AnyToBooleanNode, AnyToColorNode, ConcatStrNode,
    VarSetNode, VarGetNode
}


export type Nodes = InputNode | OutputNode | InputActionNode | OutputActionNode | ModuleNode | //  modules
    EngineReadyNode | SceneReadyNode | OnCharClickNode | // events
    DialogNode | LoadSceneNode | // interaction
    NumberNode | StringNode | ColorNode | BooleanNode | // const
    AnyToNumberNode | AnyToStringNode | AnyToBooleanNode | AnyToColorNode | ConcatStrNode | // converts
    MathNode | InvertNumberNode | RandomNode | // match
    BoolMathNode | InvertBoolNode | // bool math
    SequenceNode | LogNode | DelayNode | FlowBlockNode | FlowSetNode | FlowStatusNode | // flow
    VarSetNode | VarGetNode // vars

export class Connection<A extends Nodes, B extends Nodes> extends ClassicPreset.Connection<A, B> { }
export type Conn = Connection<NumberNode, NumberNode>