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
    const nEditor: NodeEditor<Schemes>;
    const area: AreaPlugin<Schemes, AreaExtra>
    const editor: Await<ReturnType<typeof createEditor>>
    const openModule: (path: string, add_stack?: boolean) => Promise<void>;
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
import { GameState } from './engine/game_state'
import { VarTypes } from './data_manager'

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
        const pos = { x: area.area.pointer.x - node.width / 2, y: area.area.pointer.y - node.height / 2 };
        await area.translate(node.id, pos)
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

    const add_node = (name: string) => {

    }

    const getMenuBtnVar = (name: string, type: VarTypes, is_global: boolean, is_set: boolean) => {
        // VarTypes
        const types = { 0: 'n', 1: 's', 2: 'b' };
        return { name: is_set ? "VarSet" : "VarGet", params: { t: types[type], n: name, g: is_global ? 1 : 0 } }
    }

    const make_html_node = (label: string, name: string, params: any) => {
        const pars = encodeURI(JSON.stringify(params));
        return `<a href="javascript:void(0);" class="add_node" data-name="${name}" data-params="${pars}">${label}</a>`;
    }

    const make_section = (name: string, is_end: boolean) => {
        return is_end ?
            `</div></div>` :
            `<div class="accordion">
        <div class="accordion__head">${name}</div>
        <div class="accordion__list">`
    }

    const updateItemsMenu = () => {

        const global_vars = dataManager.get_scene_variables('global');
        const scene_vars = dataManager.get_scene_variables(gameState.get_current_scene());

        let text = `<div class="listNodes__btn" data-title="node"></div>`;
        //
        text += make_section('События', false);
        text += make_html_node('Движок загружен', 'EngineReady', {});
        text += make_section('', true);
        //
        text += make_section('Константы', false);
        text += make_html_node('Число', 'Number', { val: 1 });
        text += make_html_node('Строка', 'String', { val: 'text' });
        text += make_html_node('Логическое', 'Boolean', { val: true });
        text += make_html_node('Цвет', 'Color', { val: '#ffffff' });
        text += make_section('', true);
        //
        text += make_section('Операторы', false);
        text += make_html_node('Последовательность', 'Sequence', {});
        text += make_html_node('Диалог', 'Dialog', {});
        text += make_html_node('Управляемый блок', 'FlowBlock', {});
        text += make_html_node('Задать состояние блоку', 'FlowSet', {});
        text += make_html_node('Получить состояние блока', 'FlowStatus', {});
        text += make_html_node('Логировать', 'Log', {});
        text += make_html_node('Задержка', 'Delay', { ms: 1000 });
        text += make_section('', true);
        //
        text += make_section('Преобразования', false);
        text += make_html_node('В число', 'AnyToNumber', {});
        text += make_html_node('В строку', 'AnyToString', {});
        text += make_html_node('В логическое', '', {});  // todo
        text += make_html_node('В цвет', '', {});  // todo
        text += make_html_node('Соединить строки', '', {});  // todo
        text += make_section('', true);
        //
        text += make_section('Математика', false);
        text += make_html_node('Сложить', 'Add', { A: 1, B: 2 });
        text += make_html_node('Вычесть', '', {}); // todo
        text += make_html_node('Умножить', '', {});  // todo
        text += make_html_node('Разделить', '', {});  // todo
        text += make_html_node('Сменить знак', '', {});  // todo
        text += make_html_node('Случайное целое', '', {});  // todo
        text += make_html_node('Случайное число', '', {});  // todo
        text += make_section('', true);
        //
        if (currentModulePath != 'global' && !currentModulePath?.includes('scene_')) {
            text += make_section('Модуль [вход/выход]', false);
            text += make_html_node('Вход данные', 'Input', { key: "key" });
            text += make_html_node('Выход данные', 'Output', { key: "key" });
            text += make_html_node('Вход действие', 'InputAction', { key: "key" });
            text += make_html_node('Выход действие', 'OutputAction', { key: "key" });
            text += make_section('', true);
        }
        //
        text += make_section('Модули', false);
        const list = Object.keys(modulesData);
        for (let i = 0; i < list.length; i++) {
            const it = list[i];
            if (it != currentModulePath && it != 'global' && !it.includes('scene_')) {
                text += make_html_node(it, 'Module', { name: it });
            }
        }
        text += make_section('', true);
        //
        text += make_section('Переменные общие', false);
        text += `<div class='set_block'>Задать:</div>`
        for (const k in global_vars) {
            const it = global_vars[k];
            const set_data = getMenuBtnVar(k, it.type, true, true);
            text += make_html_node(k, set_data.name, set_data.params);
        }
        text += `<div class='get_block'>Получить:</div>`
        for (const k in global_vars) {
            const it = global_vars[k];
            const get_data = getMenuBtnVar(k, it.type, true, false);
            text += make_html_node(k, get_data.name, get_data.params);
        }
        text += make_section('', true);
        //
        if (gameState.get_current_scene() != 'global') {
            text += make_section('Переменные сцены', false);
            text += `<div class='set_block'>Задать:</div>`
            for (const k in scene_vars) {
                const it = scene_vars[k];
                const set_data = getMenuBtnVar(k, it.type, true, true);
                text += make_html_node(k, set_data.name, set_data.params);
            }
            text += `<div class='get_block'>Получить:</div>`
            for (const k in scene_vars) {
                const it = scene_vars[k];
                const get_data = getMenuBtnVar(k, it.type, true, false);
                text += make_html_node(k, get_data.name, get_data.params);
            }
            text += make_section('', true);
        }
        //
        $(".listNodes").html(text);
    }


    const contextMenu = new ContextMenuPlugin<Schemes>({
        items(ctx, _) {
            if (ctx === 'root') {

                return {
                    searchBar: false,
                    list: []
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
            let title_name = path;
            if (path == 'global')
                gameState.set_current_scene(path);
            if (path.includes('scene_')) {
                gameState.set_current_scene(path);
                title_name = path.split('scene_').slice(1).join('');
            }
            $(".title_win").text((path.includes('scene_') ? 'Сцена: ' : 'Модуль: ') + title_name);
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

        if (currentModulePath != 'global') {
            $('.menu_scenes').append(`<li><a class="open_scene" data-name="global">Мир</a></li>`);
        }

        for (let name in modulesData) {
            if (name != currentModulePath) {
                const name_module = name.includes('scene_') ? name.split('scene_').slice(1).join('') : name;
                $(name.includes('scene_') ? '.menu_scenes' : ".menu_modules").append(`<li><a class="open_scene" data-name="${name}">` + name_module + `</a></li>`);
            }
        }
        $(".menu_modules").append(`<li><a class="del_module"> -Удалить- </a></li>`);
        if (modules_stack.length > 0)
            $('.btn_back').show()
        else
            $('.btn_back').hide()
        updateItemsMenu();
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
    (window as any).gameState = GameState();


    $(".node_helper").hide();
    let cur_el: JQuery<any> | null = null;
    $("body").on("dragstart", ".add_node", function () {
        $(".node_helper").show();
        cur_el = $(this);
        return false;
    });

    document.addEventListener('mouseup', async (e: MouseEvent) => {
        if (!cur_el)
            return;
        const name = cur_el.attr('data-name')!;
        const params = JSON.parse(decodeURI(cur_el.attr('data-params')!));
        console.log(name, params)
        cur_el = null;
        $(".node_helper").hide();
        addNode(name, params);
    })

    document.addEventListener('mousemove', async (e: MouseEvent) => {
        if (!cur_el)
            return;
        $(".node_helper").css({ left: e.pageX - 15 + 'px', top: e.pageY - 15 + 'px' })
    });


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
        if (e.ctrlKey && e.code == 'KeyS')
            e.preventDefault();
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
                update_code_editor();
            }
        }
        if (e.ctrlKey) {
            if (e.code == 'KeyS') {
                do_save();
                update_code_editor();
            }
        }
    }, false)



    return {
        loadModules: (data: string) => modulesData = JSON.parse(data),
        openModule,
        removeModule
    }
}

