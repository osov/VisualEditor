import { ClassicPreset, GetSchemes, NodeEditor } from "rete";
import { InputNode, OutputNode, InputActionNode, OutputActionNode } from "../nodes";


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
    const inputs_data = nodes
      .filter((n): n is InputNode => n instanceof InputNode)
      .map((n) => n.controls.key.value as string);
    const outputs_data = nodes
      .filter((n): n is OutputNode => n instanceof OutputNode)
      .map((n) => n.controls.key.value as string);

    const inputs_actions = nodes
      .filter((n): n is InputNode => n instanceof InputActionNode)
      .map((n) => n.controls.key.value as string);
    const outputs_actions = nodes
      .filter((n): n is OutputNode => n instanceof OutputActionNode)
      .map((n) => n.controls.key.value as string);

    return {
      inputs_data,
      outputs_data,
      inputs_actions,
      outputs_actions
    };
  }
}
