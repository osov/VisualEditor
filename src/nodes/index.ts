import { ClassicPreset } from 'rete'
import { AddNode } from "./add";
import { NumberNode } from "./number";
import { SequenceNode } from "./sequence"
import { ModuleNode } from '.';
import { InputNode } from './module/input';
import { OutputNode } from './module/output';

export { AddNode } from "./add";
export { NumberNode } from "./number";
export { SequenceNode } from "./sequence"
export { InputNode } from "./module/input";
export { OutputNode } from "./module/output";
export { ModuleNode } from "./module/module";

export type Nodes = NumberNode | AddNode | InputNode | OutputNode | ModuleNode | SequenceNode

export class Connection<A extends Nodes, B extends Nodes> extends ClassicPreset.Connection<A, B> { }
export type Conn = Connection<NumberNode, AddNode>