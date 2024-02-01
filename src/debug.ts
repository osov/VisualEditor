import { NumberCallback } from "./engine/types";
import { delay } from "./utils/utils";

declare global {
    const debugEditor: ReturnType<typeof DebugEditor>
}

function DebugEditor() {

    function is_active() {
        return true;
    }

    function update_flow_status(id: string, status: boolean) {
        const nodes = nEditor.getNodes();
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            if (node.label == "FlowBlock") {
                if ((node.controls as any).select.selected == id) {
                    (node.controls as any).Checkbox.active = status;
                    area.update("control", (node.controls as any).Checkbox.id);
                }
            }
        }
    }

    function covert_node_data(node: string, input: string, key: string) {
        if (node.includes('module')) {
            const tmp = node.split('_module_');
            if (key != '') {
                node = tmp[0];
                input = key;
            }
        }
        return [node, input]
    }

    function clear_nodes_animation() {
        const connections = nEditor.getConnections()
        for (let i = 0; i < connections.length; i++) {
            const con = connections[i];
            $(area.connectionViews.get(con.id)!.element).find('path').attr('class', '')
        }
    }

    function activate_node_animation(source: string, sourceOutput: string, target: string, targetInput: string, source_key = '', target_key = '') {
        const connections = nEditor.getConnections()
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

    // -------------------------------------------------------------------------------------------
    // fake game simulation
    // -------------------------------------------------------------------------------------------

    function init_debug_game() {
        $("body").on("click", ".dbg_open_scene", function () {
            const name = $(this).attr('data-name')!;
            gameState.load_scene(name);
            $("#debug_scene_name").text(name.substr('scene_'.length));
        });


        $("body").on("click", ".dbg_sel_char", function () {
            const name = $(this).text();
            gameState.trigger_character_click(name);
            $("#debug_char_name").text(name);
        });
    }

    async function run_debug_game() {
        $('debug_page').show();
        stop_debug_game();
        debugEditor.clear_nodes_animation();
        const scenes = dataManager.get_all_scenes();
        let html = '';
        for (let i = 0; i < scenes.length; i++) {
            const it = scenes[i];
            const name = it.substr('scene_'.length);
            html += `<li><a href="javascript:void(0)" class="dbg_open_scene" data-name="${it}">${name}</a></li>`;
        }
        $('#debug_scenes').html(html);

        html = '';
        const chars = dataManager.get_characters();
        for (let i = 0; i < chars.length; i++) {
            const it = chars[i];
            html += `<li><a href="javascript:void(0)" class="dbg_sel_char">${it}</a></li>`;
        }
        $('#debug_chars').html(html);

        // configure events
        const nodes = (window as any).graph.nodes;
        for (const n in nodes) {
            const node = nodes[n];
            if (['OnEngineReady', 'OnSceneUnloaded', 'OnSceneLoaded', 'OnCharClick'].includes(node.name))
                node.run();
        }
        await delay(1000);
        gameState.trigger_engine_ready();
    }

    function stop_debug_game() {
        gameState.reset_states();
        $('debug_page').hide();
        $("#debug_dialog").hide();
        $("#debug_scene_name").text('');
        $("#debug_char_name").text('');
        $('#debug_scenes').html('');
    }

    function open_dialog(user: string, text: string, answers: { id: number; answer: string; }[], cb: NumberCallback) {
        function bind_cb_button(id: number) {
            $(`#btn_${id}`).click(() => {
                cb(id);
            })
        }
        $("#debug_dialog").show();
        $("#dbg_char").html(user);
        $("#debug_text").html(text);
        let html = '';
        for (let i = 0; i < answers.length; i++) {
            const it = answers[i];
            html += `<button id="btn_${it.id}">${it.answer}</button>`;
        }
        $("#debug_buttons").html(html);
        for (let i = 0; i < answers.length; i++) {
            const it = answers[i];
            bind_cb_button(it.id);
        }
    }

    function close_dialog() {
        $("#debug_dialog").hide();
    }

    init_debug_game();
    return { is_active, clear_nodes_animation, activate_node_animation, update_flow_status, run_debug_game, stop_debug_game, open_dialog, close_dialog }
}



export function init_debug() {
    (window as any).debugEditor = DebugEditor();
}