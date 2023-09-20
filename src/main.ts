import "./style.css"
import { ClassicPreset, GetSchemes, NodeEditor } from 'rete'
import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { VuePlugin, VueArea2D, Presets as VuePresets } from 'rete-vue-plugin'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
import { ContextMenuPlugin, ContextMenuExtra, Presets as ContextMenuPresets } from 'rete-context-menu-plugin'
import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin'
import { HistoryPlugin, HistoryActions, HistoryExtensions, Presets as HistoryPreset } from "rete-history-plugin";
import { CommentPlugin, CommentExtensions } from "rete-comment-plugin";

import CustomBtn from "./CustomBtn.vue";

type Node = NumberNode | AddNode
class Connection<A extends Node, B extends Node> extends ClassicPreset.Connection<A, B> { }
type Conn = Connection<NumberNode, AddNode>

type Schemes = GetSchemes<Node, Conn>
type AreaExtra = Area2D<Schemes> | VueArea2D<Schemes> | ContextMenuExtra | MinimapExtra


const editor = new NodeEditor<Schemes>()
const render = new VuePlugin<Schemes, AreaExtra>()
const area = new AreaPlugin<Schemes, AreaExtra>(document.getElementById("app")!)
const connection = new ConnectionPlugin<Schemes, AreaExtra>()
const arrange = new AutoArrangePlugin<Schemes>()
const history = new HistoryPlugin<Schemes, HistoryActions<Schemes>>()
HistoryExtensions.keyboard(history)
const comment = new CommentPlugin<Schemes, AreaExtra>()


const contextMenu = new ContextMenuPlugin<Schemes>({
  items: ContextMenuPresets.classic.setup([
    ['Number', () => new NumberNode(1)],
    ['Add', () => new AddNode()],
  ])
})
const minimap = new MinimapPlugin<Schemes>()

editor.use(area)
area.use(render)
area.use(connection)
area.use(contextMenu)
area.use(minimap)
area.use(arrange)
area.use(history)
area.use(comment)

connection.addPreset(ConnectionPresets.classic.setup())
render.addPreset(VuePresets.classic.setup())
render.addPreset(VuePresets.contextMenu.setup())
render.addPreset(VuePresets.minimap.setup())
arrange.addPreset(ArrangePresets.classic.setup())
history.addPreset(HistoryPreset.classic.setup())

const selector = AreaExtensions.selector()
const accumulating = AreaExtensions.accumulateOnCtrl()

AreaExtensions.selectableNodes(area, selector, { accumulating })
AreaExtensions.simpleNodesOrder(area)

CommentExtensions.selectable(comment, selector, accumulating)



// ------------------------------------
const socket = new ClassicPreset.Socket('socket')

class ButtonControl extends ClassicPreset.Control {
  constructor(public label: string, public onClick: () => void) {
    super();
  }
}

render.addPreset(
  VuePresets.classic.setup({
    customize: {
      control(data) {

        if (data.payload instanceof ButtonControl) {
          return CustomBtn;
        }

        if (data.payload instanceof ClassicPreset.InputControl) {
          return VuePresets.classic.Control;
        }
      }
    }
  })
);


class NumberNode extends ClassicPreset.Node {
  width = 180
  height = 160

  constructor(initial: number, change?: (value: number) => void) {
    super('Number')

    this.addOutput('value', new ClassicPreset.Output(socket, 'Out'))
    this.addControl('value', new ClassicPreset.InputControl('number', { initial, change }))
    this.addControl('Btn', new ButtonControl('Жми', () => { }))
  }
}

class AddNode extends ClassicPreset.Node {
  width = 180
  height = 195

  constructor() {
    super('Add')

    this.addInput('a', new ClassicPreset.Input(socket, 'A'))
    this.addInput('b', new ClassicPreset.Input(socket, 'B'))
    this.addOutput('value', new ClassicPreset.Output(socket, 'Number'))
    this.addControl('result', new ClassicPreset.InputControl('number', { initial: 0, readonly: true }))
  }
}

const a = new NumberNode(1)
const b = new NumberNode(1)
const add = new AddNode()

await editor.addNode(a)
await editor.addNode(b)
await editor.addNode(add)

await editor.addConnection(new Connection(a, 'value', add, 'a'))
await editor.addConnection(new Connection(b, 'value', add, 'b'))

comment.addFrame("Тут переменные", [a.id, b.id]);
// ------------------------------


await arrange.layout({
  options: {
    'elk.spacing.nodeNode': '50',
    'elk.layered.spacing.nodeNodeBetweenLayers': '100'
  }
})
AreaExtensions.zoomAt(area, editor.getNodes())

