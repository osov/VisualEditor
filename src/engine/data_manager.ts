const tmp_modules = '{"global":{"nodes":[{"id":"n1","name":"Log","x":1217,"y":-213,"data":{"val":"Задано"}},{"id":"n2","name":"Number","x":406,"y":-660,"data":{"val":10}},{"id":"n7","name":"Sequence","x":373,"y":-497,"data":{"val":3}},{"id":"n15","name":"Log","x":1176,"y":-584,"data":{"val":"delay"}},{"id":"n0","name":"OnQuestReady","x":27,"y":-572,"data":{}},{"id":"n6","name":"Module","x":805,"y":-660,"data":{"name":"x2_inv"}},{"id":"n8","name":"Log","x":850,"y":-382,"data":{"val":"второй блок"}},{"id":"n18","name":"Module","x":654,"y":-231,"data":{"name":"add_money"}},{"id":"n19","name":"Number","x":324,"y":-123,"data":{"val":5}},{"id":"n20","name":"Sequence","x":917,"y":-182,"data":{"val":3}},{"id":"n21","name":"Log","x":1220,"y":45,"data":{"val":"Задано"}}],"connections":[{"source":"n0","sourceOutput":"out","target":"n7","targetInput":"in"},{"source":"n7","sourceOutput":"out0","target":"n15","targetInput":"in"},{"source":"n2","sourceOutput":"int","target":"n6","targetInput":"in"},{"source":"n6","sourceOutput":"out","target":"n15","targetInput":"data"},{"source":"n7","sourceOutput":"out1","target":"n8","targetInput":"in"},{"source":"n7","sourceOutput":"out2","target":"n18","targetInput":"do"},{"source":"n19","sourceOutput":"int","target":"n18","targetInput":"inc"},{"source":"n20","sourceOutput":"out0","target":"n1","targetInput":"in"},{"source":"n18","sourceOutput":"end","target":"n20","targetInput":"in"},{"source":"n18","sourceOutput":"key","target":"n21","targetInput":"data"},{"source":"n20","sourceOutput":"out1","target":"n21","targetInput":"in"}],"comments":[]},"x2_inv":{"nodes":[{"id":"n0","name":"Output","x":349,"y":-429,"data":{"key":"out"}},{"id":"n2","name":"Input","x":-609,"y":-396,"data":{"key":"in"}},{"id":"n3","name":"AnyToNumber","x":-360,"y":-377,"data":{}},{"id":"n4","name":"Mul","x":-121,"y":-352,"data":{"A":1,"B":2}},{"id":"n5","name":"InvNumber","x":109,"y":-313,"data":{}}],"connections":[{"source":"n2","sourceOutput":"m","target":"n3","targetInput":"in"},{"source":"n3","sourceOutput":"out","target":"n4","targetInput":"A"},{"source":"n3","sourceOutput":"out","target":"n4","targetInput":"B"},{"source":"n4","sourceOutput":"val","target":"n5","targetInput":"in"},{"source":"n5","sourceOutput":"out","target":"n0","targetInput":"m"}],"comments":[]},"add_money":{"nodes":[{"id":"n9","name":"Input","x":-490,"y":-327,"data":{"key":"inc"}},{"id":"n10","name":"Output","x":412,"y":-500,"data":{"key":"key"}},{"id":"n11","name":"InputAction","x":-506,"y":-64,"data":{"key":"do"}},{"id":"n12","name":"OutputAction","x":406,"y":7,"data":{"key":"end"}},{"id":"n13","name":"Sequence","x":-2,"y":-98,"data":{"val":2}},{"id":"n14","name":"AnyToNumber","x":-255,"y":-281,"data":{}},{"id":"n15","name":"VarSet","x":381,"y":-317,"data":{"t":"n","n":"money","g":1,"v":0}},{"id":"n16","name":"VarGet","x":-228,"y":-442,"data":{"t":"n","n":"money","g":1}},{"id":"n17","name":"Add","x":-14,"y":-343,"data":{"A":1,"B":2}}],"connections":[{"source":"n9","sourceOutput":"m","target":"n14","targetInput":"in"},{"source":"n13","sourceOutput":"out0","target":"n15","targetInput":"in"},{"source":"n13","sourceOutput":"out1","target":"n12","targetInput":"m"},{"source":"n16","sourceOutput":"out","target":"n17","targetInput":"A"},{"source":"n14","sourceOutput":"out","target":"n17","targetInput":"B"},{"source":"n17","sourceOutput":"val","target":"n15","targetInput":"data"},{"source":"n17","sourceOutput":"val","target":"n10","targetInput":"m"},{"source":"n11","sourceOutput":"m","target":"n13","targetInput":"in"}],"comments":[]}}';
const tmp_vars = '{"global":{"money":{"type":0,"value":0}}}'

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

    function get_characters() {
        return JSON.parse(load_from_storage('characters', '[]'))
    }

    function add_character(name: string) {
        const characters = get_characters();
        characters.push(name);
        save_to_storage('characters', JSON.stringify(characters));
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
    return { get_all_scenes, get_scene_variables, set_scene_variables, get_modules, set_modules, get_flow_list, add_flow_list, add_character, get_characters }
}

