import { Context } from "../editor";
import { Connection, InputNode, ModuleNode, NumberNode, OutputNode, SequenceNode, DialogNode, FlowBlockNode, EventReadyNode, StringNode, ColorNode, BooleanNode, LogNode, InputActionNode, OutputActionNode, DelayNode, FlowSetNode, FlowStatusNode, VarSetNode, VarGetNode, OnCharClickNode, LoadSceneNode, AnyToCustomNode, ConcatStrNode, InvertNumberNode, BoolMathNode, RandomNode, InvertBoolNode, OnSceneEventNode, InActionNode, EmptyNode } from "../nodes";
import { MathNode } from "../nodes/math/math_node";
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

  if (name === "OnEngineReady") return new EventReadyNode('OnEngineReady', 'Движок загружен')
  if (name === "OnSceneLoaded") return new OnSceneEventNode('OnSceneLoaded', 'Сцена загружена', data.id)
  if (name === "OnSceneUnloaded") return new OnSceneEventNode('OnSceneUnloaded', 'Сцена выгружена', data.id)
  if (name === "OnCharClick") return new OnCharClickNode(data.id)

  if (name === "Dialog") return new DialogNode(data)
  if (name === "CloseDialog") return new InActionNode('CloseDialog', 'Закрыть диалог')
  if (name === "LoadScene") return new LoadSceneNode(data.id)

  if (name === "Number") return new NumberNode(data.val)
  if (name === "String") return new StringNode(data.val)
  if (name === "Color") return new ColorNode(data.val)
  if (name === "Boolean") return new BooleanNode(data.val)

  if (name === "Sequence") return new SequenceNode(data.val)
  if (name === "FlowBlock") return new FlowBlockNode(data)
  if (name === "FlowSet") return new FlowSetNode(data)
  if (name === "FlowStatus") return new FlowStatusNode(data.id)
  if (name === "Log") return new LogNode(data.val)
  if (name === "Delay") return new DelayNode(data.ms)

  if (name === "AnyToNumber") return new AnyToCustomNode('number', 'число', 'AnyToNumber', 'В число')
  if (name === "AnyToString") return new AnyToCustomNode('string', 'строка', 'AnyToString', 'В строку')
  if (name === 'AnyToBoolean') return new AnyToCustomNode('boolean', 'логическое', 'AnyToBoolean', 'В логическое')
  if (name == 'AnyToColor') return new AnyToCustomNode('color', 'цвет', 'AnyToColor', 'В цвет')
  if (name == 'ConcatStr') return new ConcatStrNode(data)

  if (name === "Add") return new MathNode('Add', 'A + B', data)
  if (name === "Sub") return new MathNode('Sub', 'A - B', data)
  if (name === "Div") return new MathNode('Div', 'A / B', data)
  if (name === "Mul") return new MathNode('Mul', 'A * B', data)
  if (name === "InvNumber") return new InvertNumberNode()
  if (name === "RandInt") return new RandomNode('RandInt', 'Случайное целое', data)
  if (name === "RandFloat") return new RandomNode('RandFloat', 'Случайное число', data)

  if (name === '!') return new InvertBoolNode()
  if (name === ">") return new BoolMathNode('>', 'A > B ?', data)
  if (name === ">=") return new BoolMathNode('>=', 'A >= B ?', data)
  if (name === "<") return new BoolMathNode('<', 'A < B ?', data)
  if (name === "<=") return new BoolMathNode('<=', 'A <= B ?', data)
  if (name === "=") return new BoolMathNode('=', 'A = B ?', data)

  if (name === "VarSet") return new VarSetNode(data)
  if (name === "VarGet") return new VarGetNode(data)

  if (name === 'EmptyNode') return new EmptyNode(data.id, data.data)
  toastr.error('Нода не поддерживается:' + name)
  return new EmptyNode(name, data);
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
