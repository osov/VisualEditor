import { NumberCallback, VoidCallback } from "./types";

declare global {
    const gameState: ReturnType<typeof GameState>
}



export function GameState() {
    let flow_status: { [k: string]: boolean } = {}; // id = val
    let vars: { [k: string]: { [k: string]: any } } = {}; // scene:var = val
    let _cur_scene = '';
    let events_ready_callbacks: VoidCallback[] = [];
    let events_char_selected: { [k: string]: VoidCallback[] } = {};
    let events_scene_loaded: { [k: string]: VoidCallback[] } = {};
    let events_scene_unloaded: { [k: string]: VoidCallback[] } = {};

    //---------------------------------------------------

    function reset_states() {
        flow_status = {};
        vars = {};
        _cur_scene = '';
        events_ready_callbacks = [];
        events_char_selected = {};
        events_scene_loaded = {};
        events_scene_unloaded = {};
    }

    function set_current_scene(name: string) {
        _cur_scene = name;
    }

    function get_current_scene() {
        return _cur_scene;
    }

    //---------------------------------------------------

    function get_flow_status(id: string) {
        return flow_status[id] || false;
    }

    function set_flow_status(id: string, status: boolean) {
        flow_status[id] = status;
        debugEditor.update_flow_status(id, status);
    }

    //---------------------------------------------------

    function get_scene_var(name: string, is_cur_scene: boolean) {
        const scene = is_cur_scene ? get_current_scene() : 'global';
        const def_vars = dataManager.get_scene_variables(scene);
        if (def_vars[name] == null) {
            error('Переменная для чтения не существует:', name, scene);
            return null;
        }
        if (vars[scene] != null && vars[scene][name] != null)
            return vars[scene][name];
        return def_vars[name].value;
    }

    function set_scene_var(name: string, val: any, is_cur_scene: boolean) {
        const scene = is_cur_scene ? get_current_scene() : 'global';
        const def_vars = dataManager.get_scene_variables(scene);
        if (def_vars[name] == null) {
            error('Переменная для установки не существует:', name, scene);
            return null;
        }
        if (vars[scene] == null)
            vars[scene] = {};
        vars[scene][name] = val;
    }

    //---------------------------------------------------
    function trigger_engine_ready() {
        for (let i = 0; i < events_ready_callbacks.length; i++) {
            const cb = events_ready_callbacks[i];
            cb();
        }
    }

    function open_dialog(user: string, text: string, answers: { id: number; answer: string; }[], cb: NumberCallback) {
        //todo
        debugEditor.open_dialog(user, text, answers, cb);
    }

    function close_dialog() {
        //todo
        debugEditor.close_dialog();
    }

    function register_event_on_engine_ready(cb: VoidCallback) {
        events_ready_callbacks.push(cb);
    }

    function load_scene(scene: string) {
        if (_cur_scene == scene)
            return log('Такая сцена уже загружена:', scene);

        if (_cur_scene != '') {
            if (events_scene_unloaded['*'] != null) {
                for (let i = 0; i < events_scene_unloaded['*'].length; i++)
                    events_scene_unloaded['*'][i]();
            }
            if (events_scene_unloaded[_cur_scene] != null) {
                for (let i = 0; i < events_scene_unloaded[_cur_scene].length; i++)
                    events_scene_unloaded[_cur_scene][i]();
            }
        }
        set_current_scene(scene);
        if (events_scene_loaded['*'] != null) {
            for (let i = 0; i < events_scene_loaded['*'].length; i++)
                events_scene_loaded['*'][i]();
        }
        if (events_scene_loaded[scene] != null) {
            for (let i = 0; i < events_scene_loaded[scene].length; i++)
                events_scene_loaded[scene][i]();
        }

    }

    function register_event_on_scene_unloaded(scene: string, cb: VoidCallback) {
        if (!events_scene_unloaded[scene])
            events_scene_unloaded[scene] = [];
        events_scene_unloaded[scene].push(cb);
    }

    function register_event_on_scene_loaded(scene: string, cb: VoidCallback) {
        if (!events_scene_loaded[scene])
            events_scene_loaded[scene] = [];
        events_scene_loaded[scene].push(cb);
    }

    function trigger_character_click(name: string) {
        if (events_char_selected[name])
            for (let i = 0; i < events_char_selected[name].length; i++)
                events_char_selected[name][i]();
    }


    function register_event_on_character_click(character: string, cb: VoidCallback) {
        if (!events_char_selected[character])
            events_char_selected[character] = [];
        events_char_selected[character].push(cb);
    }
    //---------------------------------------------------

    return {
        reset_states, set_current_scene, get_current_scene, get_flow_status, set_flow_status, get_scene_var, set_scene_var,
        load_scene, close_dialog, open_dialog, trigger_engine_ready, trigger_character_click,
        register_event_on_engine_ready, register_event_on_scene_unloaded, register_event_on_scene_loaded,
        register_event_on_character_click
    }

}