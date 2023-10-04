import { Context } from "../editor";
import { Connection, AddNode, InputNode, ModuleNode, NumberNode, OutputNode, SequenceNode, DialogNode, EngineReadyNode, StringNode, ColorNode, BooleanNode, LogNode, InputActionNode, OutputActionNode, AnyToNumberNode, AnyToStringNode, DelayNode } from "../nodes";
import { removeConnections } from "./utils";

export async function createNode({ editor, area, modules }: Context, name: string, data: any) {
  if (name === "Module") {
    const node = new ModuleNode(data.name, modules.findModule, (id) => removeConnections(editor, id))
    await node.update()
    return node
  }
  if (name === "Input") return new InputNode(data.key)
  if (name === "Output") return new OutputNode(data.key)
  if (name === "InputAction") return new InputActionNode(data.key)
  if (name === "OutputAction") return new OutputActionNode(data.key)
  if (name === "EngineReady") return new EngineReadyNode()
  if (name === "Number") return new NumberNode(data.val)
  if (name === "String") return new StringNode(data.val)
  if (name === "Color") return new ColorNode(data.val)
  if (name === "Boolean") return new BooleanNode(data.val)
  if (name === "AnyToNumber") return new AnyToNumberNode()
  if (name === "AnyToString") return new AnyToStringNode()
  if (name === "Sequence") return new SequenceNode(data.val)
  if (name === "Dialog") return new DialogNode(data.val)
  if (name === "Add") return new AddNode(data)
  if (name === "Log") return new LogNode(data.val)
  if (name === "Delay") return new DelayNode(data.ms)
  toastr.error('Нода не поддерживается:' + name)
  throw new Error("Unsupported node:" + name)
}


export async function importPositions(context: Context, data: any) {
  const { nodes } = data;
  // nodes
  for (const n of nodes) {
    const node = context.editor.getNode(n.id);
    if (n.x && n.y)
      await context.area.translate(node.id, { x: n.x, y: n.y })
  }
}

export async function importEditor(context: Context, data: any, cur_module = true) {
  const { nodes, connections, comments } = data;
  // nodes
  for (const n of nodes) {
    const node = await createNode(context, n.name, n.data);
    node.id = n.id;
    await context.editor.addNode(node);
    if (n.x && n.y && cur_module)
      await context.area.translate(node.id, { x: n.x, y: n.y })
  }
  // connections
  for (const c of connections) {
    const source = context.editor.getNode(c.source);
    const target = context.editor.getNode(c.target);

    if (source && target && (source.outputs as any)[c.sourceOutput] && (target.inputs as any)[c.targetInput]) {
      const conn = new Connection(source, c.sourceOutput as never, target, c.targetInput as never);

      await context.editor.addConnection(conn);
    }
  }
  // comments
  if (cur_module && comments) {
    for (const c of comments) {
      context.comment.addFrame(c.text, c.links);
    }
  }
}

export function exportEditor(context: Context) {
  const nodes = [];
  const connections = [];
  const comments = [];

  for (const n of context.editor.getNodes()) {
    const p = context.area.nodeViews.get(n.id)!.position;
    nodes.push({
      id: n.id,
      name: n.label,
      x: Math.round(p.x), y: Math.round(p.y),
      data: n.serialize(),
    });
  }
  for (const c of context.editor.getConnections()) {
    connections.push({
      source: c.source,
      sourceOutput: c.sourceOutput,
      target: c.target,
      targetInput: c.targetInput
    });
  }

  for (const c of context.comment.comments) {
    comments.push({ text: c[1].text, links: c[1].links });
  }

  return {
    nodes,
    connections,
    comments
  };
}
