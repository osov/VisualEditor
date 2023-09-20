import { ClassicPreset, GetSchemes, NodeEditor } from 'rete'
import { AddNode } from "./add";
import { NumberNode } from "./number";
import { ModuleNode } from '.';
import { InputNode } from './module/input';
import { OutputNode } from './module/output';

export { AddNode, } from "./add";
export { NumberNode } from "./number";
export { InputNode } from "./module/input";
export { OutputNode } from "./module/output";
export { ModuleNode } from "./module/module";

export type Nodes = NumberNode | AddNode | InputNode | OutputNode | ModuleNode

export class Connection<A extends Nodes, B extends Nodes> extends ClassicPreset.Connection<A, B> { }
export type Conn = Connection<NumberNode, AddNode>