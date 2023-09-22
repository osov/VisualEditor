import { GetSchemes, NodeEditor } from 'rete'
import { Area2D, AreaExtensions, AreaPlugin } from 'rete-area-plugin'
import { ConnectionPlugin, Presets as ConnectionPresets } from 'rete-connection-plugin'
import { VuePlugin, VueArea2D, Presets as VuePresets } from 'rete-vue-plugin'
import { AutoArrangePlugin, Presets as ArrangePresets } from 'rete-auto-arrange-plugin'
import { ContextMenuPlugin, ContextMenuExtra } from 'rete-context-menu-plugin'
import { MinimapExtra, MinimapPlugin } from 'rete-minimap-plugin'
import { HistoryPlugin, HistoryActions, HistoryExtensions, Presets as HistoryPreset } from "rete-history-plugin";
import { CommentPlugin, CommentExtensions } from "rete-comment-plugin";

import { Nodes, Conn, } from "./nodes"
import { Modules } from "./utils/modules";
import { createNode, exportEditor, importEditor } from './utils/import'
import { CommentDeleteAction, clearEditor } from './/utils/utils'

import { TwoButtonControl } from "./controls"
import CustomTwoBtn from "./components/CustomTwoBtn.vue"

export type Schemes = GetSchemes<Nodes, Conn>
export type AreaExtra = Area2D<Schemes> | VueArea2D<Schemes> | ContextMenuExtra | MinimapExtra

export type Context = {
    modules: Modules<Schemes>;
    editor: NodeEditor<Schemes>;
    area: AreaPlugin<Schemes, any>;
    comment: CommentPlugin<Schemes, AreaExtra>
};

import rootModule from "./modules/root.json";
import transitModule from "./modules/transit.json";
import doubleModule from "./modules/double.json";

const modulesData: { [key in string]: any } = {
    root: rootModule,
    transit: transitModule,
    double: doubleModule
};
(window as any).modulesData = modulesData;

export async function createEditor(container: HTMLElement) {
    const editor = new NodeEditor<Schemes>(); (window as any).nEditor = editor
    const render = new VuePlugin<Schemes, AreaExtra>()
    const area = new AreaPlugin<Schemes, AreaExtra>(container)
    const connection = new ConnectionPlugin<Schemes, AreaExtra>()
    const arrange = new AutoArrangePlugin<Schemes>()
    const history = new HistoryPlugin<Schemes, HistoryActions<Schemes> | CommentDeleteAction>()
    HistoryExtensions.keyboard(history)
    const comment = new CommentPlugin<Schemes, AreaExtra>()

    const addNode = async (name: string, data: any) => {
        const node = await createNode(context, name, data);
        await context.editor.addNode(node);
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

    const contextMenu = new ContextMenuPlugin<Schemes>({
        items(ctx, plugin) {
            if (ctx === 'root') {
                return {
                    searchBar: true,
                    list: [
                        { label: 'Number', key: '1', handler: () => addNode("Number", { value: 5 }) },
                        { label: 'Add', key: '1', handler: () => addNode("Add", {}) },
                        { label: 'Последовательность', key: '1', handler: () => addNode("Sequence", {}) },
                        {
                            label: 'Module', key: '1', handler: () => null,
                            subitems: [
                                { label: 'New', key: '1', handler: () => addNode("Module", {}) },
                                { label: 'Input', key: '1', handler: () => addNode("Input", { key: "key" }) },
                                { label: 'Output', key: '1', handler: () => addNode("Input", { key: "key" }) },
                                { label: ' -> Root', key: '1', handler: () => openModule("root") },
                                { label: ' -> Transit', key: '1', handler: () => openModule("transit") },
                                { label: ' -> Double', key: '1', handler: () => openModule("double") },
                            ]
                        }
                    ]
                }
            }
            console.log(selector.entities);
            return {
                searchBar: false,
                list: [
                    {
                        label: 'Delete',
                        key: 'delete',
                        handler: async () => {
                            await deleteNode(ctx.id);
                        }
                    },
                    // {
                    //     label: 'Clone', key: '1',
                    //     handler: async () => {
                    //         const node = (ctx as any).clone()
                    //         await editor.addNode(node)
                    //         area.translate(node.id, area.area.pointer)
                    //     }
                    // },
                    { label: 'Comment', key: '1', handler: () => console.log('cm', ctx) },
                ]
            }
        }
    })
    const minimap = new MinimapPlugin<Schemes>()

    editor.use(area)
    area.use(render)
    area.use(contextMenu)
    area.use(connection)

    area.use(minimap)
    area.use(arrange)
    area.use(history)
    area.use(comment)

    connection.addPreset(ConnectionPresets.classic.setup())
    render.addPreset(
        VuePresets.classic.setup({
            customize: {
                control(data) {
                    if (data.payload instanceof TwoButtonControl) {
                        return CustomTwoBtn
                    }
                }
            }
        })
    )
    render.addPreset(VuePresets.contextMenu.setup())
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
            const data = modulesData[path];

            if (!data) throw new Error("cannot find module");
            await importEditor(
                {
                    ...context,
                    editor
                },
                data
            );
        }
    );
    const context: Context = {
        editor,
        area,
        modules,
        comment
    };


    let currentModulePath: null | string = null;

    async function openModule(path: string) {
        currentModulePath = null;

        await clearEditor(editor);
        comment.clear();

        const module = modules.findModule(path);

        if (module) {
            currentModulePath = path;
            await module.apply(editor);
            ZoomNodes();
        }


    }
    (window as any).area = area;

    document.addEventListener('mousedown', async (e: MouseEvent) => {
        if (e.button == 1)
            ZoomNodes();
    })

    document.addEventListener('keydown', async (e: KeyboardEvent) => {
        // delete
        if (e.key == 'Delete') {
            for (const entity of selector.entities) {
                if (entity[1].label == 'comment') {
                    const data = comment.comments.get(entity[1].id);
                    if (data)
                        history.add(new CommentDeleteAction(comment, data.id, data.text, data.links));
                    comment.delete(entity[1].id);
                }
                else
                    await deleteNode(entity[1].id);
            }
            selector.unselectAll();
            return;
        }
        if (e.shiftKey) {
            // comment
            if (e.code == 'KeyC') {
                const nodes_ids = [];
                for (const entity of selector.entities) {
                    nodes_ids.push(entity[1].id);
                }
                const pn = prompt('Ввод комментария', 'Комментарий')
                if (pn)
                    comment.addFrame(pn, nodes_ids);
            }
            if (e.code == 'KeyR') {
                await ArrangeNodes();
                ZoomNodes();
            }
        }
        // console.log(e);
    })

    return {
        getModules() {
            return Object.keys(modulesData);
        },
        saveModule: () => {
            if (currentModulePath) {
                const data = exportEditor(context);
                modulesData[currentModulePath] = data;
            }
        },
        restoreModule: () => {
            if (currentModulePath) openModule(currentModulePath);
        },
        newModule: (path: string) => {
            modulesData[path] = { nodes: [], connections: [] };
        },
        openModule,
        destroy: () => {
            console.log("area.destroy", area.nodeViews.size);

            area.destroy();
        }
    };
}