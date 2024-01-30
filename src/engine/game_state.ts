
declare global {
    const gameState: ReturnType<typeof GameState>
}

export function GameState() {
    const flow_status: { [k: string]: boolean } = {}; // id = val
    let vars: { [k: string]: { [k: string]: any } } = {}; // scene:var = val
    let _cur_scene = 'global';

    //---------------------------------------------------

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

    return { set_current_scene, get_current_scene, get_flow_status, set_flow_status, get_scene_var, set_scene_var }

}