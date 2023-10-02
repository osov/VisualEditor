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

import { OneButtonControl, TwoButtonControl, addCustomBackground } from "./controls"
import CustomNode from './components/CustomNode.vue';
import ControlOneBtn from "./components/ControlOneBtn.vue"
import ControlTwoBtn from "./components/ControlTwoBtn.vue"
import ActionConnection from "./components/ActionConnection.vue";
import DataConnection from "./components/DataConnection.vue";


declare global {
    const e: ReturnType<typeof iEngine>;
    const activate_node_animation: (source: string, sourceOutput: string, target: string, targetInput: string, source_key?: string, target_key?: string) => void;
    const openModule: (path: string, add_stack?: boolean) => Promise<void>;
}


export type Schemes = GetSchemes<Nodes, Conn>
export type AreaExtra = Area2D<Schemes> | VueArea2D<Schemes> | ContextMenuExtra | MinimapExtra


export type Context = {
    modules: Modules<Schemes>
    editor: NodeEditor<Schemes>
    area: AreaPlugin<Schemes, any>
    comment: CommentPlugin<Schemes, AreaExtra>
}

import { reOrderEditor, showIds } from './utils/debug'
import { DictString } from './engine/types'
import { iEngine } from './engine/iEngine'

let modulesData: { [key in string]: any } = {}
let currentModulePath: null | string = null
let modules_stack: string[] = []

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

        if (currentModulePath != 'global') {
            module_sub_items.push({
                label: 'Создать вход/выход', key: '1', handler: () => null, subitems: [
                    { label: 'Вход данные', key: '1', handler: () => addNode("Input", { key: "key" }) },
                    { label: 'Выход данные', key: '1', handler: () => addNode("Output", { key: "key" }) },
                    { label: 'Вход действие', key: '1', handler: () => addNode("InputAction", { key: "key" }) },
                    { label: 'Выход действие', key: '1', handler: () => addNode("OutputAction", { key: "key" }) },
                ]
            })
        }


        const modules_list_open = [];
        const modules_list_add = [];
        const list = Object.keys(modulesData);
        for (let i = 0; i < list.length; i++) {
            const it = list[i];
            if (it != currentModulePath) {
                modules_list_open.push({ label: it, key: '1', handler: () => openModule(it) })
                modules_list_add.push({ label: it, key: '1', handler: () => addNode("Module", { name: it }) })
            }
        }
        module_sub_items.push({ label: 'Добавить', key: '1', handler: () => null, subitems: modules_list_add })
        module_sub_items.push({ label: 'Редактировать', key: '1', handler: () => null, subitems: modules_list_open })



        context_menu_items.splice(0, context_menu_items.length);
        context_menu_items.push(
            {
                label: 'События', key: '1', handler: () => null,
                subitems: [
                    { label: 'Движок загружен', key: '1', handler: () => addNode("EngineReady", {}) },
                ]
            },
            {
                label: 'Константы', key: '1', handler: () => null,
                subitems: [
                    { label: 'Число', key: '1', handler: () => addNode("Number", { val: 1 }) },
                    { label: 'Строка', key: '1', handler: () => addNode("String", { val: 'text' }) },
                    { label: 'Логическое', key: '1', handler: () => addNode("Number", { val: 1 }) },
                    { label: 'Цвет', key: '1', handler: () => addNode("Number", { val: 1 }) },
                    { label: 'Вектор3', key: '1', handler: () => addNode("Number", { val: 1 }) },
                ]
            },
            {
                label: 'Операторы', key: '1', handler: () => null,
                subitems: [
                    { label: 'Последовательность', key: '1', handler: () => addNode("Sequence", {}) },
                    { label: 'Логировать', key: '1', handler: () => addNode("Log", {}) },
                    { label: 'Задержка', key: '1', handler: () => addNode("Delay", { ms: 1000 }) },
                ]
            },
            {
                label: 'Преобразования', key: '1', handler: () => null,
                subitems: [
                    { label: 'В число', key: '1', handler: () => addNode("AnyToNumber", {}) },
                    { label: 'В строку', key: '1', handler: () => addNode("AnyToString", {}) },
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
            },
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
                        toastr.error('Входы не совместимы:' + sockets.source.name + ' и ' + sockets.target.name);
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
                // node(context){
                //     if (context.payload.label === 'Sequence') {
                //         return CustomNode;
                //     }
                //     return VuePresets.classic.Node;
                // },
                node() {
                    return CustomNode;
                },
                control(data) {
                    if (data.payload instanceof TwoButtonControl) {
                        return ControlTwoBtn
                    }
                    if (data.payload instanceof OneButtonControl) {
                        return ControlOneBtn
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

    async function openModule(path: string, add_stack = true) {
        const tmp_name = currentModulePath
        currentModulePath = null

        await clearEditor(editor)
        comment.clear()
        const module = modules.findModule(path)

        if (module) {
            if (tmp_name && add_stack)
                modules_stack.push(tmp_name)
            currentModulePath = path
            $(".title_win").text(path);
            await module.apply(editor)
            const data = modulesData[path]
            await importPositions(context, data) // повторно обновляем позиции т.к. при импорте модулей они имеют одинаковые иды нод и соответственно перебивают позиции текущих нод на экране
            await ZoomNodes()
            update_code_editor()
            update_scenes()
        }
    }

    function update_scenes() {
        $(".menu_scenes").html('');
        for (let name in modulesData) {
            if (name != currentModulePath)
                $(".menu_scenes").append(`<li><a class="open_scene">` + name + `</a></li>`);
        }
        $(".menu_scenes").append(`<li><a class="new_scene">-Новая-</a></li>`);

        if (modules_stack.length > 0)
            $('.btn_back').show()
        else
            $('.btn_back').hide()
    }

    $("body").on("click", ".open_scene", function () {
        openModule($(this).text());
    })

    $("body").on("click", ".new_scene", function () {
        makeModule()
    })


    // debug

    const update_modules_editor = () => {
        let modules: DictString = {};
        for (const k in modulesData)
            modules[k] = JSON.stringify(modulesData[k]);
        e.set_dc_modules(modules)
    }

    const update_code_editor = () => {
        const str = JSON.stringify(exportEditor(context));
        update_modules_editor();
        e.init(str)
    }

    const save_module = (is_notify = false) => {
        if (currentModulePath) {
            const data = exportEditor(context)
            modulesData[currentModulePath] = data
            update_code_editor()
            if (is_notify)
                toastr.success('Сохранено')
            return data
        }
        if (is_notify)
            toastr.error('Ошибка сохранения')
        return null
    }

    const clear_nodes_animation = () => {
        const connections = editor.getConnections()
        for (let i = 0; i < connections.length; i++) {
            const con = connections[i];
            $(area.connectionViews.get(con.id)!.element).find('path').attr('class', '')
        }
    }

    const covert_node_data = (node: string, input: string, key: string) => {
        if (node.includes('module')) {
            const tmp = node.split('_module_');
            if (key != '') {
                node = tmp[0];
                input = key;
            }
        }
        return [node, input]
    }

    const activate_node_animation = (source: string, sourceOutput: string, target: string, targetInput: string, source_key = '', target_key = '') => {
        const connections = editor.getConnections()
        //console.log("Activate:", source, sourceOutput, target, targetInput, source_key, target_key)
        for (let i = 0; i < connections.length; i++) {
            const con = connections[i];
            [source, sourceOutput] = covert_node_data(source, sourceOutput, source_key);
            [target, targetInput] = covert_node_data(target, targetInput, target_key);
            if (con.source == source && con.target == target && con.sourceOutput == sourceOutput && con.targetInput == targetInput) {
                $(area.connectionViews.get(con.id)!.element).find('path').attr('class', 'animated')
                return;
            }
        }
        if (source.includes('module') || target.includes('module'))
            return;
        return console.warn('Данные не найдены', source, sourceOutput, target, targetInput)
    }


    (window as any).nEditor = editor;
    (window as any).modulesData = modulesData;
    (window as any).area = area;
    (window as any).modules_stack = modules_stack;
    (window as any).openModule = openModule;
    (window as any).activate_node_animation = activate_node_animation;

    $('.btn_back').click(function () {
        if (modules_stack.length > 0) {
            const name = modules_stack.pop()
            openModule(name!, false)
        }
    });

    $(".debug_btn").click(async function () {
        const cmd = $(this).attr('data-id')
        if (cmd == 'show_ids')
            showIds(editor, area);
        else if (cmd == 'update_code')
            update_code_editor();
        else if (cmd == 'order') {
            reOrderEditor(editor, area as any, comment as any);
            // todo fail is history active
            //save_module()
            //await openModule(currentModulePath!, false)
            showIds(editor, area);
        }
        else if (cmd == 'save_code') {
            const saved = exportEditor(context)
            localStorage['debug_saved'] = JSON.stringify(saved)
            toastr.success('Сохранено');
        }
        else if (cmd == 'load_code') {
            if (!localStorage['debug_saved'])
                return toastr.error('Нет сохраненных данных');
            const data = JSON.parse(localStorage['debug_saved']);
            await clearEditor(editor)
            comment.clear()
            await importEditor({ ...context, editor }, data, true)
            toastr.success('Загружено');
        }
        else if (cmd == 'save_module') {
            save_module(true)
        }
        else if (cmd == 'save_all') {
            if (save_module(true))
                localStorage['data'] = JSON.stringify(modulesData)
        }
    });

    editor.addPipe((context) => {
        if (["connectioncreated", "connectionremoved", 'nodecreated', 'noderemoved'].includes(context.type)) {
            update_code_editor()
        }
        return context;
    });



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
            if (e.code == 'KeyS') {
                if (save_module(true))
                    localStorage['data'] = JSON.stringify(modulesData)
            }
        }
    })



    return {
        loadModules(data: string) {
            modulesData = JSON.parse(data)
        },
        getModules() {
            return Object.keys(modulesData)
        },
        getModuleString(name: string) {
            return JSON.stringify(modulesData[name])
        },
        saveModule: () => {
            save_module()
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

