const tmp_modules = '{"global":{"nodes":[{"id":"n0","name":"OnEngineReady","x":12,"y":175,"data":{}},{"id":"n1","name":"Log","x":717,"y":32,"data":{"val":"Готов..."}},{"id":"n2","name":"Number","x":99,"y":604,"data":{"val":1}},{"id":"n5","name":"Add","x":360,"y":310,"data":{"A":5,"B":2}},{"id":"n6","name":"VarGet","x":92,"y":436,"data":{"t":"n","n":"my_int","g":1}},{"id":"n7","name":"VarSet","x":700,"y":203,"data":{"t":"n","n":"my_int","g":1,"v":125}},{"id":"n8","name":"Sequence","x":330,"y":12,"data":{"val":3}},{"id":"n10","name":"IfElse","x":719,"y":445,"data":{}},{"id":"n11","name":"Log","x":1032,"y":323,"data":{"val":"истина"}},{"id":"n12","name":"Log","x":1034,"y":558,"data":{"val":"ложь"}},{"id":"n13","name":">=","x":350,"y":540,"data":{"A":0,"B":0}}],"connections":[{"source":"n0","sourceOutput":"out","target":"n8","targetInput":"in"},{"source":"n8","sourceOutput":"out0","target":"n1","targetInput":"in"},{"source":"n8","sourceOutput":"out1","target":"n7","targetInput":"in"},{"source":"n6","sourceOutput":"out","target":"n5","targetInput":"B"},{"source":"n8","sourceOutput":"out2","target":"n10","targetInput":"in"},{"source":"n10","sourceOutput":"else","target":"n12","targetInput":"in"},{"source":"n6","sourceOutput":"out","target":"n13","targetInput":"A"},{"source":"n2","sourceOutput":"out","target":"n13","targetInput":"B"},{"source":"n13","sourceOutput":"val","target":"n10","targetInput":"con"},{"source":"n10","sourceOutput":"then","target":"n11","targetInput":"in"},{"source":"n5","sourceOutput":"val","target":"n7","targetInput":"data"}],"comments":[]}}';
const tmp_vars = '{"global":{"my_int":{"type":0,"value":42}}}'

declare global {
    const dataManager: ReturnType<typeof DataManager>
}

export async function load_data_manager() {
    (window as any).dataManager = DataManager();
}

export enum VarTypes {
    NUMBER,
    STRING,
    BOOLEAN,
}

export type VarSet = { [k: string]: { type: VarTypes, value: string | number } }

export type CharacterInfo = { name: string, ava: string }

function DataManager() {

    function init_test_data() {
        if (!load_from_storage('modules'))
            save_to_storage('modules', tmp_modules)

        if (!load_from_storage('vars'))
            save_to_storage('vars', tmp_vars)
    }

    function save_to_storage(key: string, data: string) {
        localStorage[key] = data
    }

    function load_from_storage(key: string, def: string | null = null) {
        const result = localStorage[key];
        if (result == undefined && def != null)
            return def;
        return result;
    }

    //---------------------------------------------------

    function get_modules() {
        return load_from_storage('modules', '{}')
    }

    function set_modules(data: string) {
        save_to_storage('modules', data);
    }

    //---------------------------------------------------

    function get_all_scenes() {
        const modules = JSON.parse(get_modules());
        const scenes = [];
        for (const k in modules) {
            if (k.includes('quest_'))
                scenes.push(k);
        }
        return scenes;
    }

  
    //---------------------------------------------------

    function get_scene_variables(scene: string): VarSet {
        const str_vars = load_from_storage('vars', '{}')
        const variables_data = JSON.parse(str_vars)
        if (variables_data[scene])
            return variables_data[scene]
        else
            return {}
    }

    function set_scene_variables(scene: string, variables: VarSet) {
        const str_vars = load_from_storage('vars', '{}')
        const variables_data = JSON.parse(str_vars)
        variables_data[scene] = variables;
        save_to_storage('vars', JSON.stringify(variables_data))
    }

    //---------------------------------------------------

    function get_flow_list(): string[] {
        const str_flows = load_from_storage('flows', '[]')
        const data_flows = JSON.parse(str_flows);
        return data_flows;
    }

    function add_flow_list(name: string) {
        const list = get_flow_list();
        list.push(name);
        save_to_storage('flows', JSON.stringify(list));
    }


    init_test_data();
    return { get_all_scenes, get_scene_variables, set_scene_variables, get_modules, set_modules, get_flow_list, add_flow_list }
}

