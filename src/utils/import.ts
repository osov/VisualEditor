import { Context } from "../editor";
import { Connection, AddNode, InputNode, ModuleNode, NumberNode, OutputNode, SequenceNode } from "../nodes";
import { removeConnections } from "./utils";

export async function createNode({ editor, area, modules }: Context, name: string, data: any) {
  if (name === "Number") return new NumberNode(data.value);
  if (name === "Add") return new AddNode(() => { }, data);
  if (name === "Sequence") return new SequenceNode()
  if (name === "Input") return new InputNode(data.key);
  if (name === "Output") return new OutputNode(data.key);
  if (name === "Module") {
    const node = new ModuleNode(
      data.name,
      modules.findModule,
      (id) => removeConnections(editor, id),
      (id) => area.update("node", id)
    );
    await node.update();
    return node;
  }
  throw new Error("Unsupported node");
}

export async function importEditor(context: Context, data: any) {
  const { nodes, connections, comments } = data;
  // nodes
  for (const n of nodes) {
    const node = await createNode(context, n.name, n.data);
    node.id = n.id;
    await context.editor.addNode(node);
    if (n.x && n.y)
      await context.area.translate(node.id, { x: n.x, y: n.y })
  }
  // connections
  for (const c of connections) {
    const source = context.editor.getNode(c.source);
    const target = context.editor.getNode(c.target);

    if (
      source &&
      target &&
      (source.outputs as any)[c.sourceOutput] &&
      (target.inputs as any)[c.targetInput]
    ) {
      const conn = new Connection(
        source,
        c.sourceOutput as never,
        target,
        c.targetInput as never
      );

      await context.editor.addConnection(conn);
    }
  }
  // comments
  if (comments) {
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
      x: p.x, y: p.y,
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
