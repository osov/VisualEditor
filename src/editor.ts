import { GetSchemes, NodeEditor } from 'rete'
import { Area2D, AreaExtensions, AreaPlugin, Drag } from 'rete-area-plugin'
import { ClassicFlow, ConnectionPlugin, getSourceTarget } from 'rete-connection-plugin'
import { VuePlugin, VueArea2D, Presets as VuePresets } from 'rete-vue-plugin'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
import { ContextMenuPlugin, ContextMenuExtra } from 'rete-context-menu-plugin'
import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin'
import { HistoryPlugin, HistoryActions, HistoryExtensions, Presets as HistoryPreset } from "rete-history-plugin"
import { CommentPlugin, CommentExtensions } from "rete-comment-plugin"

import { Nodes, Conn, Connection, } from "./nodes"
import { Modules } from "./utils/modules"
import { createNode, exportEditor, importEditor } from './utils/import'
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
    const makeScene: () => void;
    const updateItemsMenu: () => void;
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
import { DictString, INodeGraph } from './engine/types'
import { iEngine } from './engine/iEngine'
import { GameState } from './engine/game_state'
import { VarTypes } from './engine/data_manager'
import { remove_empty_lines } from './engine/utils'

let modulesData: { [k: string]: any } = {}
let currentModulePath: null | string = null
let modules_stack: string[] = []
let copiedNodes: { name: string; data: any; position: { x: number; y: number } }[] = []

export async function createEditor(container: HTMLElement) {

    const editor = new NodeEditor<Schemes>()
    const render = new VuePlugin<Schemes, AreaExtra>()
    const area = new AreaPlugin<Schemes, AreaExtra>(container)
    const connection = new ConnectionPlugin<Schemes, AreaExtra>()
    const arrange = new AutoArrangePlugin<Schemes>()
    const history = new HistoryPlugin<Schemes, HistoryActions<Schemes> | CommentDeleteAction>()
    HistoryExtensions.keyboard(history)
    const comment = new CommentPlugin<Schemes, AreaExtra>()

    let node_counter = 0;
    function find_free_id() {
        let id = 'n' + (node_counter++);
        while (editor.getNodes().filter(n => n.id == id).length > 0) {
            id = 'n' + (node_counter++);
        }
        return id
    }

    const addNode = async (name: string, data: any) => {
        const node = await createNode(context, name, data)
        node.id = find_free_id();
        await context.editor.addNode(node)
        const pos = { x: area.area.pointer.x - node.width / 2, y: area.area.pointer.y - node.height / 2 };
        await area.translate(node.id, pos)
    }

    const copySelectedNodes = () => {
        copiedNodes = []

        for (const [, entity] of selector.entities) {
            if (entity.label === 'node') {
            const node = nEditor.getNode(entity.id)
            if (node) {
                const view = area.nodeViews.get(node.id)
                copiedNodes.push({
                    name: node.label,
                    data: node.serialize(),
                    position: view ? { ...view.position } : { x: 0, y: 0 }
                })
            }
            }
        }

        console.log('Copied nodes:', copiedNodes.length)
    }

    const pasteCopiedNodes = async () => {
        if (!copiedNodes.length) return

        // смещение, чтобы вся группа легла под курсор
        const minX = Math.min(...copiedNodes.map(n => n.position.x))
        const minY = Math.min(...copiedNodes.map(n => n.position.y))

        for (const { name, data, position } of copiedNodes) {
            const node = await createNode(context, name, data)
            node.id = find_free_id()
            await context.editor.addNode(node)

            const base = {
            x: area.area.pointer.x + (position.x - minX),
            y: area.area.pointer.y + (position.y - minY)
            }
            await area.translate(node.id, base)
        }

        console.log('Pasted', copiedNodes.length)
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
        const name = prompt('Ввод имени функции');
        if (!name)
            return;
        if (modulesData[name])
            return toastr.error('Функция с таким именем уже существует:' + name);
        modulesData[name] = { "nodes": [], "connections": [], "comments": [] };
        openModule(name);
    }

    const makeScene = async () => {
        let name = prompt('Ввод имени квеста');
        if (!name)
            return;
        name = 'quest_' + name;
        if (modulesData[name])
            return toastr.error('Квест с таким именем уже существует:' + name);
        modulesData[name] = { "nodes": [], "connections": [], "comments": [] };
        save_module(true);
        openModule(name);
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

        let text = '';
        //
        if (currentModulePath != 'global' && !currentModulePath?.includes('quest_')) {
            text += make_section('Функции [вход/выход]', false);
            text += make_html_node('Вход данные', 'Input', { key: "key" });
            text += make_html_node('Выход данные', 'Output', { key: "key" });
            text += make_html_node('Вход действие', 'InputAction', { key: "key" });
            text += make_html_node('Выход действие', 'OutputAction', { key: "key" });
            text += make_section('', true);
        }
        //
        text += make_section('События', false);
        text += make_html_node('Квест загружен', 'OnQuestReady', {});
        text += make_html_node('Вошел в регион', 'OnRegionEnter', {});
        text += make_html_node('Покинул регион', 'OnRegionLeave', {});
        text += make_html_node('Взаимодействие с NPC', 'OnInteractNPC', {});
        text += make_html_node('Сменился на этап', 'StageEvent', { id: 0 });
        text += make_section('', true);
        //
        text += make_section('Этап квеста', false);
        text += make_html_node('Сменить', 'StageSet', { id: 0 });
        text += make_html_node('Получить', 'StageGet', {});
        text += make_section('', true);
        //
        text += make_section('Взаимодействие', false);
        text += make_html_node('Загрузить сцену', 'LoadScene', {});
        text += make_html_node('Диалог', 'Dialog', { cnt: 3, answers: ['', '', ''], index: '', text: 'Привет' });
        text += make_html_node('Закрыть диалог', 'CloseDialog', {});
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
        text += make_html_node('Вход/Выход', 'InOut', {});
        text += make_html_node('Условный выбор', 'IfElse', {});
        text += make_html_node('Управляемый блок', 'FlowBlock', {});
        text += make_html_node('Задать состояние блоку', 'FlowSet', {});
        text += make_html_node('Получить состояние блока', 'FlowStatus', {});
        text += make_html_node('Задержка', 'Delay', { ms: 1000 });
        text += make_html_node('Логировать', 'Log', {});
        text += make_section('', true);
        //
        text += make_section('Преобразования', false);
        text += make_html_node('В число', 'AnyToNumber', {});
        text += make_html_node('В строку', 'AnyToString', {});
        text += make_html_node('В логическое', 'AnyToBoolean', {});
        text += make_html_node('В цвет', 'AnyToColor', {});
        text += make_html_node('Соединить строки', 'ConcatStr', {});
        text += make_section('', true);
        //
        text += make_section('Математика', false);
        text += make_html_node('Сложить', 'Add', { A: 1, B: 2 });
        text += make_html_node('Вычесть', 'Sub', { A: 1, B: 2 });
        text += make_html_node('Умножить', 'Mul', { A: 1, B: 2 });
        text += make_html_node('Разделить', 'Div', { A: 1, B: 2 });
        text += make_html_node('Сменить знак', 'InvNumber', {});
        text += make_html_node('Случайное целое', 'RandInt', { A: 0, B: 100 });
        text += make_html_node('Случайное число', 'RandFloat', { A: 0, B: 100 });
        text += make_section('', true);
        //
        text += make_section('Логические операции', false);
        text += make_html_node('Отрицание', '!', {});
        text += make_html_node('Больше', '>', {});
        text += make_html_node('Больше или =', '>=', {});
        text += make_html_node('Меньше', '<', {});
        text += make_html_node('Меньше или =', '<=', {});
        text += make_html_node('Равно', '=', {});
        text += make_section('', true);
        //
        text += make_section('Юзер-функции', false);
        const list = Object.keys(modulesData);
        for (let i = 0; i < list.length; i++) {
            const it = list[i];
            if (it != currentModulePath && it != 'global' && !it.includes('quest_')) {
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
            text += make_section('Переменные квеста', false);
            text += `<div class='set_block'>Задать:</div>`
            for (const k in scene_vars) {
                const it = scene_vars[k];
                const set_data = getMenuBtnVar(k, it.type, false, true);
                text += make_html_node(k, set_data.name, set_data.params);
            }
            text += `<div class='get_block'>Получить:</div>`
            for (const k in scene_vars) {
                const it = scene_vars[k];
                const get_data = getMenuBtnVar(k, it.type, false, false);
                text += make_html_node(k, get_data.name, get_data.params);
            }
            text += make_section('', true);
        }
        //
        $(".listNodes .my_scroll").html(text);
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

    addCustomBackground(area);

    // Отключаем zoom только по dblclick через pipeline
    area.addPipe((context) => {
        if (context.type === 'zoom' && context.data.source === 'dblclick') return;
        return context;
    });

    // таскание только ПКМ, ЛКМ отключаем для таскания сцены
    area.area.setDragHandler(new Drag({
        down: e => {
            // Только ПКМ
            if (e.pointerType === 'mouse' && e.button !== 2) return false;

            // Если курсор на ноде или input — запрещаем drag
            const target = e.target as HTMLElement;
            if (target.closest('.node') || target.closest('input') || target.closest('textarea')) return false;


            e.preventDefault();
            return true;
        },
        move: () => true
    }));
    
    
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
                        toastr.error('Входы не совместимы:<br>' + sockets.source.name + ' и ' + sockets.target.name);
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

    const modules = new Modules<Schemes>((path) => modulesData[path], async (path, editor) => {
        const data = modulesData[path]
        if (!data) throw new Error("cannot find module")
        await importEditor({ ...context, editor }, data, path == currentModulePath)
    }
    )
    const context: Context = { editor, area, modules, comment }

    async function openModule(path: string, add_stack = true, ignore_zoom = false) {
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
            if (path.includes('quest_')) {
                gameState.set_current_scene(path);
                title_name = path.split('quest_').slice(1).join('');
            }
            $(".title_win").text((path.includes('quest_') || path == 'global' ? 'Квест: ' : 'Функция: ') + title_name);
            await module.apply(editor)
            if (!ignore_zoom)
                await ZoomNodes()
            update_code_editor()
            update_scenes()
        }
    }

    async function removeModule(name: string) {
        if (!modulesData[name])
            return toastr.error('Функция с таким именем не найден');
        delete modulesData[name];
        update_scenes()
    }

    function update_scenes() {
        $(".menu_scenes").html('<li><a class="new_scene">-Новый-</a></li>');
        $(".menu_modules").html('<li><a class="new_module">-Новая-</a></li>');

        if (currentModulePath != 'global') {
            // $('.menu_scenes').append(`<li><a class="open_scene" data-name="global">Мир</a></li>`);
        }

        for (let name in modulesData) {
            if (name != currentModulePath) {
                const name_module = name.includes('quest_') ? name.split('quest_').slice(1).join('') : name;
                $((name.includes('quest_') || name == 'global') ? '.menu_scenes' : ".menu_modules").append(`<li><a class="open_scene" data-name="${name}">` + name_module + `</a></li>`);
            }
        }
        $(".menu_scenes").append(`<li><a class="del_scene"> -Удалить- </a></li>`);
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
        (window as any).graph = e.init(str);
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
    (window as any).makeScene = makeScene;
    (window as any).updateItemsMenu = updateItemsMenu;
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
        if (cmd == 'show_ids') {
            showIds(editor, area);
            update_code_editor();
        }
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
            update_code_editor();
        }
        else if (cmd == 'run') {
            debugEditor.run_debug_game();
        }
        else if (cmd == 'clean_ui_nodes') {
            debugEditor.clear_nodes_animation();
        }
        if (cmd == 'build') {
            const code = await build_quest(currentModulePath!);
            log(code);
        }
        else if (cmd == 'build_all') {
            let last_module = currentModulePath;
            let code = '';
            let t = Date.now();
            for (const name in modulesData) {
                if (name == 'global' || name.includes('quest_')) {
                    code += '\n// ---------------------------------------------------------------';
                    code += '\n// ' + name;
                    code += '\n// ---------------------------------------------------------------\n';
                    code += await build_quest(name);
                    code += '\n\n';
                }
            }
            if (last_module != currentModulePath)
                await openModule(last_module!, false, true);
            log(code);
            //console.log('time:', Date.now() - t);
        }
    });

    function find_comment(id_node: string) {
        for (const [c, com] of comment.comments) {
            if (com.links.includes(id_node))
                return com.text;
        }
        return '';
    }

    const event_nodes = ['OnQuestReady', 'OnRegionEnter', 'OnRegionLeave', 'OnInteractNPC', 'StageEvent'];
    async function build_quest(name: string) {
        if (name != currentModulePath)
            await openModule(name, false, true);
        const nodes = (window as any).graph.nodes as INodeGraph;
        let code = ``;
        for (const n in nodes) {
            const node = nodes[n];
            if (event_nodes.includes(node.name)) {
                code += '\n// ' + find_comment(n) + ' ['+node.name + ']\n';
                code += remove_empty_lines(node.code(0));
                code += '\n';
            }
        }
        return code;
    }

    editor.addPipe((context) => {
        if (["connectioncreated", "connectionremoved", 'nodecreated', 'noderemoved'].includes(context.type)) {
            update_code_editor()
            save_module(false)
        }
        return context;
    });



    document.addEventListener('mousedown', async (e: MouseEvent) => {
        if (e.button == 1)
            ZoomNodes();
        update_code_editor();
    })


    document.addEventListener('keydown', async (e: KeyboardEvent) => {
        const target = e.target as HTMLElement;
        if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

        // --- системные блокировки ---
        if (e.ctrlKey && ['KeyS', 'KeyR'].includes(e.code)) {
            e.preventDefault();
        }


        // --- Ctrl+C ---
        if (e.ctrlKey && e.code === 'KeyC') {
            e.preventDefault();
            copySelectedNodes();
            return
        }

        // --- Ctrl+V ---
        if (e.ctrlKey && e.code === 'KeyV') {
            e.preventDefault();
            if (!copiedNodes.length) return
            pasteCopiedNodes();
            return
        }

        // --- Delete ---
        if (e.key === 'Delete') {
            for (const entity of selector.entities) {
                if (entity[1].label === 'comment') {
                    const data = comment.comments.get(entity[1].id);
                    if (data) {
                        history.add(new CommentDeleteAction(comment, data.id, data.text, data.links));
                    }
                    comment.delete(entity[1].id);
                } else {
                    await deleteNode(entity[1].id);
                }
            }
            selector.unselectAll();
            return;
        }

        // --- Shift-команды ---
        if (e.shiftKey) {
            if (e.code === 'KeyC') {
                const nodes_ids = []
                for (const entity of selector.entities) {
                    nodes_ids.push(entity[1].id)
                }
                const pn = prompt('Ввод комментария', 'Комментарий')
                if (pn) comment.addFrame(pn, nodes_ids)
            }
            if (e.code === 'KeyR') {
                await ArrangeNodes();
                await ZoomNodes();
            }
        }

        // --- Ctrl-команды ---
        if (e.ctrlKey) {
            if (e.code === 'KeyS') {
                do_save();
                update_code_editor();
            }
            if (e.code === 'KeyR') {
                await ArrangeNodes();
                await ZoomNodes();
            }
        }
    }, false);



    return {
        loadModules: (data: string) => modulesData = JSON.parse(data),
        openModule,
        removeModule
    }
}

