import { GetSchemes, NodeEditor } from 'rete'
import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin'
import { ClassicFlow, ConnectionPlugin, getSourceTarget } from 'rete-connection-plugin'
import { VuePlugin, VueArea2D, Presets as VuePresets } from 'rete-vue-plugin'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
import { ContextMenuPlugin, ContextMenuExtra } from 'rete-context-menu-plugin'
import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin'
import { HistoryPlugin, HistoryActions, HistoryExtensions, Presets as HistoryPreset } from "rete-history-plugin"
import { CommentPlugin, CommentExtensions } from "rete-comment-plugin"

import { Nodes, Conn, Connection, } from "./nodes"
import { Modules } from "./utils/modules"
import { createNode, exportEditor, importEditor, importPositions } from './utils/import'
import { CommentDeleteAction, clearEditor, getConnectionSockets, isCompatibleSockets } from './utils/utils'

import { TwoButtonControl, addCustomBackground } from "./controls"
import CustomTwoBtn from "./components/CustomTwoBtn.vue"
import ActionConnection from "./components/ActionConnection.vue";
import DataConnection from "./components/DataConnection.vue";

export type Schemes = GetSchemes<Nodes, Conn>
export type AreaExtra = Area2D<Schemes> | VueArea2D<Schemes> | ContextMenuExtra | MinimapExtra

export type Context = {
    modules: Modules<Schemes>
    editor: NodeEditor<Schemes>
    area: AreaPlugin<Schemes, any>
    comment: CommentPlugin<Schemes, AreaExtra>
}

import rootModule from "./modules/root.json"
import transitModule from "./modules/transit.json"
import doubleModule from "./modules/double.json"
import { reOrderEditor } from './utils/debug'


const modulesData: { [key in string]: any } = {
    global: rootModule,
    transit: transitModule,
    double: doubleModule
}
let currentModulePath: null | string = null

export async function createEditor(container: HTMLElement) {

    const editor = new NodeEditor<Schemes>()
    const render = new VuePlugin<Schemes, AreaExtra>()
    const area = new AreaPlugin<Schemes, AreaExtra>(container)
    const connection = new ConnectionPlugin<Schemes, AreaExtra>()
    const arrange = new AutoArrangePlugin<Schemes>()
    const history = new HistoryPlugin<Schemes, HistoryActions<Schemes> | CommentDeleteAction>()
    HistoryExtensions.keyboard(history)
    const comment = new CommentPlugin<Schemes, AreaExtra>()

    const addNode = async (name: string, data: any) => {
        const node = await createNode(context, name, data)
        await context.editor.addNode(node)
        await area.translate(node.id, area.area.pointer)
    }

    const deleteNode = async (nodeId: string) => {
        const connections = editor.getConnections().filter(c => {
            return c.source === nodeId || c.target === nodeId
        })
        for (const connection of connections) {
            await editor.removeConnection(connection.id)
        }
        await editor.removeNode(nodeId)
    }

    const ArrangeNodes = async () => {
        await arrange.layout({
            options: {
                'elk.spacing.nodeNode': '50',
                'elk.layered.spacing.nodeNodeBetweenLayers': '100'
            }
        })
    }

    const ZoomNodes = async () => {
        AreaExtensions.zoomAt(area, editor.getNodes())
    }

    const makeModule = async () => {
        const name = prompt('Ввод имени модуля');
        if (!name)
            return;
        if (modulesData[name])
            return toastr.error('Модуль с таким именем уже существует:' + name);
        modulesData[name] = { "nodes": [], "connections": [], "comments": [] };
        openModule(name);
    }

    const context_menu_items: any[] = [];
    const updateItemsMenu = () => {
        const module_sub_items: any[] = [
            { label: 'Новый', key: '1', handler: () => makeModule() },
        ]

        if (currentModulePath != 'root') {
            module_sub_items.push({
                label: 'Создать', key: '1', handler: () => null, subitems: [
                    { label: 'Вход данные', key: '1', handler: () => addNode("Input", { key: "key" }) },
                    { label: 'Выход данные', key: '1', handler: () => addNode("Input", { key: "key" }) },
                ]
            })
        }


        const modules_list = [];
        const list = Object.keys(modulesData);
        for (let i = 0; i < list.length; i++) {
            const it = list[i];
            if (it != currentModulePath)
                modules_list.push({ label: it, key: '1', handler: () => openModule(it) })
        }
        module_sub_items.push({ label: 'Открыть', key: '1', handler: () => null, subitems: modules_list })

        context_menu_items.splice(0, context_menu_items.length);
        context_menu_items.push(
            {
                label: 'События', key: '1', handler: () => null,
                subitems: [
                    { label: 'Движок загружен', key: '1', handler: () => addNode("EngineReady", {}) },
                ]
            },
            {
                label: 'Операторы', key: '1', handler: () => null,
                subitems: [
                    { label: 'Последовательность', key: '1', handler: () => addNode("Sequence", {}) },
                ]
            },
            {
                label: 'Константы', key: '1', handler: () => null,
                subitems: [
                    { label: 'Число', key: '1', handler: () => addNode("Number", { val: 1 }) },
                    { label: 'Строка', key: '1', handler: () => addNode("Number", { val: 1 }) },
                    { label: 'Логическое', key: '1', handler: () => addNode("Number", { val: 1 }) },
                    { label: 'Цвет', key: '1', handler: () => addNode("Number", { val: 1 }) },
                    { label: 'Вектор3', key: '1', handler: () => addNode("Number", { val: 1 }) },
                ]
            },
            {
                label: 'Преобразования', key: '1', handler: () => null,
                subitems: [
                    { label: 'В число', key: '1', handler: () => { } },
                    { label: 'В строку', key: '1', handler: () => { } },
                    { label: 'В логическое', key: '1', handler: () => { } },
                    { label: 'В цвет', key: '1', handler: () => { } },
                    { label: 'В вектор', key: '1', handler: () => { } },
                    { label: 'Соединить строки', key: '1', handler: () => { } },
                ]
            },
            {
                label: 'Математика', key: '1', handler: () => null,
                subitems: [
                    { label: 'Сложить', key: '1', handler: () => addNode("Add", { A: 1, B: 2 }) },
                    { label: 'Вычесть', key: '1', handler: () => { } },
                    { label: 'Умножить', key: '1', handler: () => { } },
                    { label: 'Разделить', key: '1', handler: () => { } },
                    { label: 'Сменить знак', key: '1', handler: () => { } },
                    { label: 'Случайное целое', key: '1', handler: () => { } },
                    { label: 'Случайное число', key: '1', handler: () => { } },
                ]
            },
            {
                label: 'Модуль', key: '1', handler: () => null,
                subitems: module_sub_items
            }

        );
    }



    const contextMenu = new ContextMenuPlugin<Schemes>({
        items(ctx, _) {
            if (ctx === 'root') {
                updateItemsMenu();
                return {
                    searchBar: false,
                    list: context_menu_items
                }
            }
            return {
                searchBar: false,
                list: [
                    {
                        label: 'Удалить',
                        key: 'delete',
                        handler: async () => {
                            await deleteNode(ctx.id)
                        }
                    },
                    {
                        label: 'Клонировать', key: '1',
                        handler: async () => {
                            addNode(ctx.label, { ...ctx.serialize() })
                        }
                    },
                ]
            }
        }
    })
    const minimap = new MinimapPlugin<Schemes>()

    addCustomBackground(area)

    editor.use(area)
    area.use(render)
    area.use(contextMenu)
    area.use(connection)

    area.use(minimap)
    area.use(arrange)
    area.use(history)
    area.use(comment)

    connection.addPreset(
        () =>
            new ClassicFlow({
                canMakeConnection(from, to) {
                    // this function checks if the old connection should be removed
                    const [source, target] = getSourceTarget(from, to) || [null, null];

                    if (!source || !target || from === to) return false;

                    const sockets = getConnectionSockets(editor, new Connection(editor.getNode(source.nodeId), source.key as never, editor.getNode(target.nodeId), target.key as never));

                    if (!isCompatibleSockets(sockets.source, sockets.target)) {
                        console.warn("Sockets are not compatible", sockets);
                        connection.drop();
                        return false;
                    }

                    return Boolean(source && target);
                },
                makeConnection(from, to, context) {
                    const [source, target] = getSourceTarget(from, to) || [null, null];
                    const { editor } = context;

                    if (source && target) {
                        editor.addConnection(new Connection(editor.getNode(source.nodeId), source.key as never, editor.getNode(target.nodeId), target.key as never));
                        return true;
                    }
                }
            })
    );

    render.addPreset(
        VuePresets.classic.setup({
            customize: {
                control(data) {
                    if (data.payload instanceof TwoButtonControl) {
                        return CustomTwoBtn
                    }
                    if (data.payload)
                        return VuePresets.classic.Control
                },
                connection(data) {
                    const { source, target } = getConnectionSockets(editor, data.payload);
                    if ((source && source.name == 'action') || (target && target.name == 'action'))
                        return ActionConnection;
                    return DataConnection;
                }
            }
        })
    )
    render.addPreset(VuePresets.contextMenu.setup({ delay: 100 }))
    render.addPreset(VuePresets.minimap.setup())
    arrange.addPreset(ArrangePresets.classic.setup())
    history.addPreset(HistoryPreset.classic.setup())

    const selector = AreaExtensions.selector()
    const accumulating = AreaExtensions.accumulateOnCtrl()

    AreaExtensions.selectableNodes(area, selector, { accumulating })
    AreaExtensions.simpleNodesOrder(area)
    AreaExtensions.showInputControl(area,)
    CommentExtensions.selectable(comment, selector, accumulating)

    const modules = new Modules<Schemes>(
        (path) => modulesData[path],
        async (path, editor) => {
            const data = modulesData[path]
            if (!data) throw new Error("cannot find module")
            await importEditor({ ...context, editor }, data, path == currentModulePath)
        }
    )
    const context: Context = { editor, area, modules, comment }

    async function openModule(path: string) {
        currentModulePath = null

        await clearEditor(editor)
        comment.clear()
        const module = modules.findModule(path)

        if (module) {
            currentModulePath = path
            await module.apply(editor)
            const data = modulesData[path]
            await importPositions(context, data) // повторно обновляем позиции т.к. при импорте модулей они имеют одинаковые иды нод и соответственно перебивают позиции текущих нод на экране
            await ZoomNodes()

        }
    }

    // debug
    (window as any).nEditor = editor;
    (window as any).modulesData = modulesData;
    (window as any).area = area;
    (window as any).order = () => reOrderEditor(editor, area as any, comment as any);


    document.addEventListener('mousedown', async (e: MouseEvent) => {
        if (e.button == 1)
            ZoomNodes()
    })

    document.addEventListener('keydown', async (e: KeyboardEvent) => {
        // delete
        if (e.key == 'Delete') {
            for (const entity of selector.entities) {
                if (entity[1].label == 'comment') {
                    const data = comment.comments.get(entity[1].id)
                    if (data)
                        history.add(new CommentDeleteAction(comment, data.id, data.text, data.links))
                    comment.delete(entity[1].id)
                }
                else
                    await deleteNode(entity[1].id)
            }
            selector.unselectAll()
            return;
        }
        if (e.shiftKey) {
            // comment
            if (e.code == 'KeyC') {
                const nodes_ids = []
                for (const entity of selector.entities) {
                    nodes_ids.push(entity[1].id)
                }
                const pn = prompt('Ввод комментария', 'Комментарий')
                if (pn)
                    comment.addFrame(pn, nodes_ids)
            }
            if (e.code == 'KeyR') {
                await ArrangeNodes()
                await ZoomNodes()
            }
        }
    })



    return {
        getModules() {
            return Object.keys(modulesData)
        },
        saveModule: () => {
            if (currentModulePath) {
                const data = exportEditor(context)
                modulesData[currentModulePath] = data
                return data
            }
        },
        restoreModule: () => {
            if (currentModulePath) openModule(currentModulePath)
        },
        newModule: (path: string) => {
            modulesData[path] = { nodes: [], connections: [] }
        },
        openModule,
        destroy: () => {
            console.log("area.destroy", area.nodeViews.size)

            area.destroy()
        }
    }
}

