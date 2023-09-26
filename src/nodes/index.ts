import { ClassicPreset } from 'rete'

export { InputNode } from "./module/input";
export { OutputNode } from "./module/output";
export { ModuleNode } from "./module/module";
import { ModuleNode } from '.';
import { InputNode } from './module/input';
import { OutputNode } from './module/output';

import { EngineReadyNode } from './engineReady';
import { AddNode } from "./add";
import { NumberNode } from "./number";
import { SequenceNode } from "./sequence"


export { AddNode } from "./add";
export { NumberNode } from "./number";
export { SequenceNode } from "./sequence"
export { EngineReadyNode } from './engineReady';


export type Nodes = InputNode | OutputNode | ModuleNode | //  modules
    EngineReadyNode | // events
    NumberNode | AddNode | SequenceNode

export class Connection<A extends Nodes, B extends Nodes> extends ClassicPreset.Connection<A, B> { }
export type Conn = Connection<NumberNode, AddNode>