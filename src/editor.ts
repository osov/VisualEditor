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

import { OneButtonControl, TwoButtonControl, addCustomBackground, CheckboxControl, SelectControl, TextareaControl, UserControl } from "./controls"
import CustomNode from './components/CustomNode.vue';
import ControlOneBtn from "./components/ControlOneBtn.vue"
import ControlTwoBtn from "./components/ControlTwoBtn.vue"
import ControlCheckbox from "./components/ControlCheckbox.vue"
import ControlSelect from "./components/ControlSelect.vue"
import ControlTextarea from "./components/ControlTextarea.vue"
import ControlUser from "./components/ControlUser.vue"
import ActionConnection from "./components/ActionConnection.vue";
import DataConnection from "./components/DataConnection.vue";

type Await<T> = T extends PromiseLike<infer U> ? U : T

declare global {
    const e: ReturnType<typeof iEngine>;
    const editor: Await<ReturnType<typeof createEditor>>
    const openModule: (path: string, add_stack?: boolean) => Promise<void>;
    const activate_node_animation: (source: string, sourceOutput: string, target: string, targetInput: string, source_key?: string, target_key?: string) => void;
    const clear_nodes_animation: () => void;
    const makeModule: () => void;
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

let modulesData: { [k: string]: any } = {}
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
        let module_sub_items: any[] = []

        if (currentModulePath != 'global' && !currentModulePath?.includes('scene_')) {
            module_sub_items.push({
                label: 'вход/выход', key: '1', handler: () => null, subitems: [
                    { label: 'Вход данные', key: '1', handler: () => addNode("Input", { key: "key" }) },
                    { label: 'Выход данные', key: '1', handler: () => addNode("Output", { key: "key" }) },
                    { label: 'Вход действие', key: '1', handler: () => addNode("InputAction", { key: "key" }) },
                    { label: 'Выход действие', key: '1', handler: () => addNode("OutputAction", { key: "key" }) },
                ]
            })
        }

        const list = Object.keys(modulesData);
        for (let i = 0; i < list.length; i++) {
            const it = list[i];
            if (it != currentModulePath && it != 'global' && !it.includes('scene_')) {
                module_sub_items.push({ label: it, key: '1', handler: () => addNode("Module", { name: it }) })
            }
        }


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
                    { label: 'Логическое', key: '1', handler: () => addNode("Boolean", { val: true }) },
                    { label: 'Цвет', key: '1', handler: () => addNode("Color", { val: '#ffffff' }) },
                    { label: 'Вектор3', key: '1', handler: () => addNode("Number", { val: 1 }) },
                ]
            },
            {
                label: 'Операторы', key: '1', handler: () => null,
                subitems: [
                    { label: 'Диалог', key: '1', handler: () => addNode("Dialog", {}) },
                    { label: 'Управляемый блок', key: '1', handler: () => addNode("FlowBlock", {}) },
                    { label: 'Задать состояние блоку', key: '1', handler: () => addNode("FlowSet", {}) },
                    { label: 'Получить состояние блока', key: '1', handler: () => addNode("FlowStatus", {}) },
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
                    if (data.payload instanceof CheckboxControl) {
                        return ControlCheckbox
                    }
                    if (data.payload instanceof SelectControl) {
                        return ControlSelect
                    }
                    if (data.payload instanceof TextareaControl) {
                        return ControlTextarea
                    }
                    if (data.payload instanceof UserControl) {
                        return ControlUser
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
        save_module(false)
        const tmp_name = currentModulePath
        currentModulePath = null
        await clearEditor(editor)
        comment.clear()
        const module = modules.findModule(path)

        if (module) {
            if (tmp_name && add_stack)
                modules_stack.push(tmp_name)
            currentModulePath = path
            $(".title_win").text((path.includes('scene_') ? 'Сцена: ' : 'Модуль: ') + path);
            await module.apply(editor)
            //const data = modulesData[path]
            //  await importPositions(context, data) // повторно обновляем позиции т.к. при импорте модулей они имеют одинаковые иды нод и соответственно перебивают позиции текущих нод на экране
            await ZoomNodes()

            update_code_editor()
            update_scenes()
        }
    }

    async function removeModule(name: string) {
        if (!modulesData[name])
            return toastr.error('Модуль с таким именем не найден');
        delete modulesData[name];
        update_scenes()
    }

    function update_scenes() {
        $(".menu_scenes").html('');
        $(".menu_modules").html('<li><a class="new_scene">-Новый-</a></li>');


        for (let name in modulesData) {
            if (name != currentModulePath) {
                $(name.includes('scene_') ? '.menu_scenes' : ".menu_modules").append(`<li><a class="open_scene">` + name + `</a></li>`);
            }
        }
        $(".menu_modules").append(`<li><a class="del_module"> -Удалить- </a></li>`);
        if (modules_stack.length > 0)
            $('.btn_back').show()
        else
            $('.btn_back').hide()
    }




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

    const save_module = (is_save_cache = false) => {
        if (currentModulePath) {
            const data = exportEditor(context)
            modulesData[currentModulePath] = data
            if (is_save_cache)
                dataManager.set_modules(JSON.stringify(modulesData))
            return data
        }

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

    const do_save = () => {
        if (save_module(true))
            toastr.success('Сохранено');
        else
            toastr.error('Ошибка сохранения');
    }


    (window as any).nEditor = editor;
    (window as any).modulesData = modulesData;
    (window as any).area = area;
    (window as any).modules_stack = modules_stack;
    (window as any).openModule = openModule;
    (window as any).makeModule = makeModule;
    (window as any).activate_node_animation = activate_node_animation;
    (window as any).clear_nodes_animation = clear_nodes_animation;

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
        else if (cmd == 'order') {
            reOrderEditor(editor, area as any, comment as any);
            // todo fail is history active
            //save__module()
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
        else if (cmd == 'save') {
            do_save();
        }
    });

    editor.addPipe((context) => {
        if (["connectioncreated", "connectionremoved", 'nodecreated', 'noderemoved'].includes(context.type)) {
            update_code_editor()
            save_module(false)
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
                do_save();
            }
        }
    })



    return {
        loadModules: (data: string) => modulesData = JSON.parse(data),
        openModule,
        removeModule
    }
}

