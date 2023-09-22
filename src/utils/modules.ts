import { ClassicPreset, GetSchemes, NodeEditor } from "rete";
import { InputNode, OutputNode } from "../nodes";


export type Schemes = GetSchemes<ClassicPreset.Node, any>;

export type Module<S extends Schemes> = {
  apply: (editor: NodeEditor<S>) => Promise<void>;
};

export class Modules<S extends Schemes> {
  constructor(
    private has: (path: string) => boolean,
    private graph: (path: string, editor: NodeEditor<S>) => Promise<void>
  ) { }

  public findModule = (path: string): null | Module<S> => {
    if (!this.has(path)) return null;
    return {
      apply: (editor: NodeEditor<S>) => this.graph(path, editor),

    };
  };


  public static getPorts(editor: NodeEditor<Schemes>) {
    const nodes = editor.getNodes();
    const inputs = nodes
      .filter((n): n is InputNode => n instanceof InputNode)
      .map((n) => n.controls.key.value as string);
    const outputs = nodes
      .filter((n): n is OutputNode => n instanceof OutputNode)
      .map((n) => n.controls.key.value as string);

    return {
      inputs,
      outputs
    };
  }
}
