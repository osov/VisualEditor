const tmp_modules = '{"global":{"nodes":[{"id":"n0","name":"OnEngineReady","x":-154,"y":735,"data":{}},{"id":"n1","name":"Log","x":89,"y":734,"data":{"val":"Готов..."}},{"id":"n2","name":"OnCharClick","x":121,"y":258,"data":{"id":"Иван"}},{"id":"n3","name":"Dialog","x":386,"y":287,"data":{"cnt":3,"si":"","user":"Иван","text":"Привет, я твой помощник, что бы ты хотел узнать ?","answers":["Cколько у тебя груш?","отдай мне все груши","ничего, пока"]}},{"id":"n4","name":"String","x":286,"y":1289,"data":{"val":"у меня: "}},{"id":"n5","name":"ConcatStr","x":601,"y":1412,"data":{"A":"","B":""}},{"id":"n6","name":"String","x":601,"y":1594,"data":{"val":" груш, что ты хочешь еще ?"}},{"id":"n7","name":"VarGet","x":-24,"y":1622,"data":{"t":"n","n":"груша","g":1}},{"id":"n8","name":"AnyToString","x":286,"y":1597,"data":{}},{"id":"n9","name":"ConcatStr","x":936,"y":1474,"data":{"A":"","B":""}},{"id":"n10","name":"Dialog","x":1738,"y":575,"data":{"cnt":3,"si":"s","user":"Иван","text":"","answers":["добавить 1","отдать 1","на этом хватит"]}},{"id":"n11","name":"CloseDialog","x":1959,"y":963,"data":{}},{"id":"n12","name":"Dialog","x":1508,"y":38,"data":{"cnt":1,"si":"","user":"Иван","text":"Вот, держи","answers":["Спасибо, пока"]}},{"id":"n14","name":"VarSet","x":1518,"y":-100,"data":{"t":"n","n":"груша","g":1,"val":0,"v":0}},{"id":"n16","name":"CloseDialog","x":1802,"y":154,"data":{}},{"id":"n17","name":"CloseDialog","x":694,"y":729,"data":{}},{"id":"n15","name":"VarSet","x":2689,"y":746,"data":{"t":"n","n":"груша","g":1,"v":0}},{"id":"n13","name":"Sequence","x":1031,"y":-36,"data":{"val":2}},{"id":"n18","name":"Sequence","x":2266,"y":571,"data":{"val":2}},{"id":"n19","name":"VarGet","x":2051,"y":1589,"data":{"t":"n","n":"груша","g":1}},{"id":"n20","name":"Add","x":2438,"y":818,"data":{"A":1,"B":1}},{"id":"n21","name":"Dialog","x":3246,"y":575,"data":{"cnt":1,"si":"","user":"Иван","text":"Готово","answers":["Дальше"]}},{"id":"n22","name":"Sub","x":2280,"y":1538,"data":{"A":1,"B":1}},{"id":"n23","name":"VarSet","x":2504,"y":1465,"data":{"t":"n","n":"груша","g":1,"v":0}},{"id":"n24","name":"Sequence","x":2162,"y":1235,"data":{"val":2}},{"id":"n25","name":"VarGet","x":2216,"y":850,"data":{"t":"n","n":"груша","g":1}},{"id":"n26","name":"InOut","x":3529,"y":-94,"data":{}},{"id":"n27","name":"InOut","x":2146,"y":238,"data":{}},{"id":"n28","name":"OnCharClick","x":-7,"y":-1804,"data":{"id":"Маша"}},{"id":"n29","name":"Dialog","x":663,"y":-1995,"data":{"cnt":3,"si":"b","user":"Маша","text":"Привет, как твои дела ?","answers":["Всё хорошо","очень плохо","ты ведь уже спрашивала"]}},{"id":"n30","name":"Boolean","x":419,"y":-1722,"data":{"val":true}},{"id":"n31","name":"VarGet","x":440,"y":-1555,"data":{"t":"b","n":"диалог был","g":1}},{"id":"n32","name":"Dialog","x":1279,"y":-2132,"data":{"cnt":1,"si":"","user":"Маша","text":"Рада за тебя","answers":["до встречи"]}},{"id":"n33","name":"CloseDialog","x":1571,"y":-1825,"data":{}},{"id":"n34","name":"Dialog","x":1263,"y":-1479,"data":{"cnt":3,"si":"","user":"Маша","text":"А что у тебя случилось ?","answers":["сам не знаю","да нет настроения","уйти"]}},{"id":"n35","name":"VarSet","x":1095,"y":-1693,"data":{"t":"b","n":"диалог был","g":1,"v":true}},{"id":"n36","name":"Dialog","x":1260,"y":-970,"data":{"cnt":1,"si":"","user":"Маша","text":"Извини, уже забыла :(","answers":["ну пока"]}},{"id":"n37","name":"Dialog","x":1878,"y":-1716,"data":{"cnt":1,"si":"","user":"Маша","text":"Эх, ладно, пока","answers":["пока"]}},{"id":"n38","name":"CloseDialog","x":1574,"y":-916,"data":{}},{"id":"n39","name":"CloseDialog","x":2279,"y":-1252,"data":{}},{"id":"n40","name":"Dialog","x":1876,"y":-1159,"data":{"cnt":1,"si":"","user":"Маша","text":"Да, бывает","answers":["до встречи"]}}],"connections":[{"source":"n4","sourceOutput":"out","target":"n5","targetInput":"A"},{"source":"n7","sourceOutput":"out","target":"n8","targetInput":"in"},{"source":"n8","sourceOutput":"out","target":"n5","targetInput":"B"},{"source":"n5","sourceOutput":"val","target":"n9","targetInput":"A"},{"source":"n6","sourceOutput":"out","target":"n9","targetInput":"B"},{"source":"n3","sourceOutput":"out0","target":"n10","targetInput":"in"},{"source":"n9","sourceOutput":"val","target":"n10","targetInput":"in_text"},{"source":"n10","sourceOutput":"out2","target":"n11","targetInput":"in"},{"source":"n12","sourceOutput":"out0","target":"n16","targetInput":"in"},{"source":"n2","sourceOutput":"out","target":"n3","targetInput":"in"},{"source":"n3","sourceOutput":"out2","target":"n17","targetInput":"in"},{"source":"n0","sourceOutput":"out","target":"n1","targetInput":"in"},{"source":"n3","sourceOutput":"out1","target":"n13","targetInput":"in"},{"source":"n13","sourceOutput":"out1","target":"n12","targetInput":"in"},{"source":"n13","sourceOutput":"out0","target":"n14","targetInput":"in"},{"source":"n18","sourceOutput":"out0","target":"n15","targetInput":"in"},{"source":"n20","sourceOutput":"val","target":"n15","targetInput":"data"},{"source":"n18","sourceOutput":"out1","target":"n21","targetInput":"in"},{"source":"n10","sourceOutput":"out0","target":"n18","targetInput":"in"},{"source":"n19","sourceOutput":"out","target":"n22","targetInput":"A"},{"source":"n22","sourceOutput":"val","target":"n23","targetInput":"data"},{"source":"n24","sourceOutput":"out0","target":"n23","targetInput":"in"},{"source":"n24","sourceOutput":"out1","target":"n21","targetInput":"in"},{"source":"n10","sourceOutput":"out1","target":"n24","targetInput":"in"},{"source":"n25","sourceOutput":"out","target":"n20","targetInput":"A"},{"source":"n21","sourceOutput":"out0","target":"n26","targetInput":"in"},{"source":"n26","sourceOutput":"out","target":"n27","targetInput":"in"},{"source":"n27","sourceOutput":"out","target":"n10","targetInput":"in"},{"source":"n28","sourceOutput":"out","target":"n29","targetInput":"in"},{"source":"n30","sourceOutput":"out","target":"n29","targetInput":"in0"},{"source":"n30","sourceOutput":"out","target":"n29","targetInput":"in1"},{"source":"n31","sourceOutput":"out","target":"n29","targetInput":"in2"},{"source":"n29","sourceOutput":"out0","target":"n32","targetInput":"in"},{"source":"n32","sourceOutput":"out0","target":"n33","targetInput":"in"},{"source":"n29","sourceOutput":"out1","target":"n34","targetInput":"in"},{"source":"n29","sourceOutput":"out0","target":"n35","targetInput":"in"},{"source":"n29","sourceOutput":"out1","target":"n35","targetInput":"in"},{"source":"n29","sourceOutput":"out2","target":"n36","targetInput":"in"},{"source":"n36","sourceOutput":"out0","target":"n38","targetInput":"in"},{"source":"n34","sourceOutput":"out2","target":"n38","targetInput":"in"},{"source":"n37","sourceOutput":"out0","target":"n39","targetInput":"in"},{"source":"n34","sourceOutput":"out0","target":"n37","targetInput":"in"},{"source":"n34","sourceOutput":"out1","target":"n40","targetInput":"in"},{"source":"n40","sourceOutput":"out0","target":"n39","targetInput":"in"}],"comments":[{"text":"формирование текста ответа","links":["n7","n4","n8","n6","n5","n9"]},{"text":"уменьшаем груши","links":["n22","n19","n23","n24"]},{"text":"добавляем груши","links":["n18","n25","n20","n15"]},{"text":"все отдали","links":["n13","n14","n12","n16"]},{"text":"диалог с машей","links":["n32","n35","n29","n30","n31","n28","n36","n34","n33","n38","n37","n39","n40"]}]}}';
const tmp_vars = '{"global":{"груша":{"type":0,"value":1},"диалог был":{"type":2,"value":0}}}'
const tmp_characters = '["Маша", "Иван"]';

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

        if (!load_from_storage('characters'))
            save_to_storage('characters', tmp_characters)
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
        const modules = json.decode(get_modules());
        const scenes = [];
        for (const k in modules) {
            if (k.includes('scene_'))
                scenes.push(k);
        }
        return scenes;
    }

    //---------------------------------------------------

    function get_characters() {
        return json.decode(load_from_storage('characters', '[]'))
    }

    function add_character(name: string) {
        const characters = get_characters();
        characters.push(name);
        save_to_storage('characters', json.encode(characters));
    }

    //---------------------------------------------------

    function get_scene_variables(scene: string): VarSet {
        const str_vars = load_from_storage('vars', '{}')
        const variables_data = json.decode(str_vars)
        if (variables_data[scene])
            return variables_data[scene]
        else
            return {}
    }

    function set_scene_variables(scene: string, variables: VarSet) {
        const str_vars = load_from_storage('vars', '{}')
        const variables_data = json.decode(str_vars)
        variables_data[scene] = variables;
        save_to_storage('vars', json.encode(variables_data))
    }

    //---------------------------------------------------

    function get_flow_list(): string[] {
        const str_flows = load_from_storage('flows', '[]')
        const data_flows = json.decode(str_flows);
        return data_flows;
    }

    function add_flow_list(name: string) {
        const list = get_flow_list();
        list.push(name);
        save_to_storage('flows', json.encode(list));
    }


    init_test_data();
    return { get_all_scenes, get_characters, add_character, get_scene_variables, set_scene_variables, get_modules, set_modules, get_flow_list, add_flow_list }
}

