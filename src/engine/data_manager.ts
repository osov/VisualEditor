const tmp_modules = '{"global":{"nodes":[],"connections":[],"comments":[]}, "quest_Кузнец":{"nodes":[{"id":"n7","name":"Sequence","x":131,"y":-1046,"data":{"val":3}},{"id":"n15","name":"Log","x":533,"y":-1042,"data":{"val":"ready"}},{"id":"n0","name":"OnQuestReady","x":-109,"y":-1047,"data":{}},{"id":"n1","name":"StageSet","x":1298,"y":-408,"data":{"id":1}},{"id":"n2","name":"StageEvent","x":-125,"y":2250,"data":{"id":99}},{"id":"n6","name":"OnInteractNPC","x":-126,"y":-582,"data":{"id":"blacksmith"}},{"id":"n8","name":"OnRegionEnter","x":-119,"y":768,"data":{"id":"shore_zone"}},{"id":"n9","name":"Dialog","x":481,"y":-609,"data":{"cnt":2,"text":"Привет, путник! У меня просьба.\\nЯ весь в работе и никак не могу отойти.\\nНе мог бы ты сходить к морю и посмотреть, приплыл ли мой племянник?","answers":["Конечно, схожу к морю","Извини, у меня нет времени"],"index":"blacksmith"}},{"id":"n10","name":"FlowBlock","x":196,"y":-541,"data":{"id":"talked_to_blacksmith","active":false}},{"id":"n11","name":"FlowSet","x":1262,"y":-611,"data":{"id":"talked_to_blacksmith","ac":false}},{"id":"n3","name":"Sequence","x":866,"y":-537,"data":{"val":4}},{"id":"n4","name":"Sequence","x":865,"y":-200,"data":{"val":2}},{"id":"n13","name":"FlowSet","x":1461,"y":-610,"data":{"id":"quest_active","ac":true}},{"id":"n14","name":"StageSet","x":1272,"y":-78,"data":{"id":99}},{"id":"n16","name":"CloseDialog","x":1518,"y":-233,"data":{}},{"id":"n17","name":"OnInteractNPC","x":-124,"y":256,"data":{"id":"blacksmith"}},{"id":"n18","name":"FlowBlock","x":177,"y":240,"data":{"id":"quest_active","active":true}},{"id":"n19","name":"FlowBlock","x":404,"y":236,"data":{"id":"went_to_shore","active":false}},{"id":"n5","name":"Dialog","x":683,"y":228,"data":{"cnt":1,"text":"Ты ещё не сходил к морю?\\nПожалуйста, узнай, всё ли с ним в порядке.","answers":["Еще нет"],"index":"blacksmith"}},{"id":"n20","name":"Dialog","x":1001,"y":227,"data":{"cnt":1,"text":"Иди к морю и посмотри, не приплыл ли мой племянник.","answers":["Хорошо"],"index":"blacksmith"}},{"id":"n21","name":"CloseDialog","x":1304,"y":331,"data":{}},{"id":"n22","name":"FlowBlock","x":151,"y":806,"data":{"id":"quest_active","active":true}},{"id":"n23","name":"FlowBlock","x":360,"y":803,"data":{"id":"went_to_shore","active":false}},{"id":"n24","name":"Sequence","x":672,"y":812,"data":{"val":2}},{"id":"n25","name":"FlowSet","x":997,"y":753,"data":{"id":"went_to_shore","ac":true}},{"id":"n26","name":"Dialog","x":980,"y":959,"data":{"cnt":1,"text":"Ты подошёл к морю и осмотрелся...\\nВдалеке виднеется лодка — кажется, племянник кузнеца приплыл.","answers":["Рассказать кузнецу"],"index":"Голос за кадром"}},{"id":"n27","name":"CloseDialog","x":1308,"y":1044,"data":{}},{"id":"n28","name":"Dialog","x":143,"y":2174,"data":{"cnt":1,"text":"Ты отказался помочь кузнецу.\\n","answers":["Уйти"],"index":"Голос за кадром"}},{"id":"n29","name":"CloseDialog","x":475,"y":2392,"data":{}},{"id":"n32","name":"FlowBlock","x":152,"y":1585,"data":{"id":"quest_active","active":true}},{"id":"n33","name":"FlowBlock","x":350,"y":1581,"data":{"id":"went_to_shore","active":true}},{"id":"n34","name":"FlowBlock","x":549,"y":1577,"data":{"id":"quest_completed","active":false}},{"id":"n35","name":"Dialog","x":772,"y":1552,"data":{"cnt":1,"text":"Ну как, ты был у моря? Видел ли моего племянника?","answers":["Да, он приплыл. Всё в порядке"],"index":"blacksmith"}},{"id":"n36","name":"FlowSet","x":1408,"y":1523,"data":{"id":"quest_completed","ac":true}},{"id":"n37","name":"Sequence","x":1074,"y":1656,"data":{"val":3}},{"id":"n38","name":"CloseDialog","x":1409,"y":1895,"data":{}},{"id":"n39","name":"Module","x":1675,"y":1769,"data":{"name":"add_money"}},{"id":"n40","name":"Number","x":1436,"y":1718,"data":{"val":500}},{"id":"n41","name":"OnInteractNPC","x":-115,"y":1574,"data":{"id":"blacksmith"}}],"connections":[{"source":"n0","sourceOutput":"out","target":"n7","targetInput":"in"},{"source":"n7","sourceOutput":"out0","target":"n15","targetInput":"in"},{"source":"n6","sourceOutput":"out","target":"n10","targetInput":"in"},{"source":"n10","sourceOutput":"out","target":"n9","targetInput":"in"},{"source":"n9","sourceOutput":"out0","target":"n3","targetInput":"in"},{"source":"n3","sourceOutput":"out0","target":"n11","targetInput":"in"},{"source":"n9","sourceOutput":"out1","target":"n4","targetInput":"in"},{"source":"n3","sourceOutput":"out1","target":"n13","targetInput":"in"},{"source":"n4","sourceOutput":"out1","target":"n14","targetInput":"in"},{"source":"n4","sourceOutput":"out0","target":"n16","targetInput":"in"},{"source":"n3","sourceOutput":"out2","target":"n16","targetInput":"in"},{"source":"n3","sourceOutput":"out3","target":"n1","targetInput":"in"},{"source":"n17","sourceOutput":"out","target":"n18","targetInput":"in"},{"source":"n18","sourceOutput":"out","target":"n19","targetInput":"in"},{"source":"n19","sourceOutput":"out","target":"n5","targetInput":"in"},{"source":"n5","sourceOutput":"out0","target":"n20","targetInput":"in"},{"source":"n20","sourceOutput":"out0","target":"n21","targetInput":"in"},{"source":"n8","sourceOutput":"out","target":"n22","targetInput":"in"},{"source":"n22","sourceOutput":"out","target":"n23","targetInput":"in"},{"source":"n23","sourceOutput":"out","target":"n24","targetInput":"in"},{"source":"n24","sourceOutput":"out0","target":"n25","targetInput":"in"},{"source":"n24","sourceOutput":"out1","target":"n26","targetInput":"in"},{"source":"n26","sourceOutput":"out0","target":"n27","targetInput":"in"},{"source":"n2","sourceOutput":"out","target":"n28","targetInput":"in"},{"source":"n28","sourceOutput":"out0","target":"n29","targetInput":"in"},{"source":"n32","sourceOutput":"out","target":"n33","targetInput":"in"},{"source":"n33","sourceOutput":"out","target":"n34","targetInput":"in"},{"source":"n34","sourceOutput":"out","target":"n35","targetInput":"in"},{"source":"n35","sourceOutput":"out0","target":"n37","targetInput":"in"},{"source":"n37","sourceOutput":"out0","target":"n36","targetInput":"in"},{"source":"n37","sourceOutput":"out1","target":"n39","targetInput":"do"},{"source":"n40","sourceOutput":"int","target":"n39","targetInput":"inc"},{"source":"n37","sourceOutput":"out2","target":"n38","targetInput":"in"},{"source":"n41","sourceOutput":"out","target":"n32","targetInput":"in"}],"comments":[{"text":"Инициализация, можно задать какие-то переменные...","links":["n15","n7","n0"]},{"text":"Этап 0 — Разговор с кузнецом","links":["n3","n4","n14","n1","n11","n13","n10","n6","n9","n16"]},{"text":"Этап 1 — Напоминание от кузнеца","links":["n21","n20","n5","n18","n17","n19"]},{"text":"Отказали кузнецу | TODO: не все переменные заданы или так и надо ?","links":["n2","n28","n29"]},{"text":"Этап 2 — Игрок входит в регион моря","links":["n24","n25","n26","n27","n8","n22","n23"]},{"text":"Этап 3 — Сообщение кузнецу о племяннике","links":["n32","n33","n34","n35","n37","n36","n40","n39","n38","n41"]}]},"x2_inv":{"nodes":[{"id":"n0","name":"Output","x":349,"y":-429,"data":{"key":"out"}},{"id":"n2","name":"Input","x":-609,"y":-396,"data":{"key":"in"}},{"id":"n3","name":"AnyToNumber","x":-360,"y":-377,"data":{}},{"id":"n4","name":"Mul","x":-121,"y":-352,"data":{"A":1,"B":2}},{"id":"n5","name":"InvNumber","x":109,"y":-313,"data":{}}],"connections":[{"source":"n2","sourceOutput":"m","target":"n3","targetInput":"in"},{"source":"n3","sourceOutput":"out","target":"n4","targetInput":"A"},{"source":"n3","sourceOutput":"out","target":"n4","targetInput":"B"},{"source":"n4","sourceOutput":"val","target":"n5","targetInput":"in"},{"source":"n5","sourceOutput":"out","target":"n0","targetInput":"m"}],"comments":[]},"add_money":{"nodes":[{"id":"n9","name":"Input","x":-490,"y":-327,"data":{"key":"inc"}},{"id":"n10","name":"Output","x":412,"y":-500,"data":{"key":"key"}},{"id":"n11","name":"InputAction","x":-506,"y":-64,"data":{"key":"do"}},{"id":"n12","name":"OutputAction","x":406,"y":7,"data":{"key":"end"}},{"id":"n13","name":"Sequence","x":-2,"y":-98,"data":{"val":2}},{"id":"n14","name":"AnyToNumber","x":-255,"y":-281,"data":{}},{"id":"n15","name":"VarSet","x":381,"y":-317,"data":{"t":"n","n":"money","g":1,"v":0}},{"id":"n16","name":"VarGet","x":-228,"y":-442,"data":{"t":"n","n":"money","g":1}},{"id":"n17","name":"Add","x":-14,"y":-343,"data":{"A":1,"B":2}}],"connections":[{"source":"n9","sourceOutput":"m","target":"n14","targetInput":"in"},{"source":"n13","sourceOutput":"out0","target":"n15","targetInput":"in"},{"source":"n13","sourceOutput":"out1","target":"n12","targetInput":"m"},{"source":"n16","sourceOutput":"out","target":"n17","targetInput":"A"},{"source":"n14","sourceOutput":"out","target":"n17","targetInput":"B"},{"source":"n17","sourceOutput":"val","target":"n15","targetInput":"data"},{"source":"n17","sourceOutput":"val","target":"n10","targetInput":"m"},{"source":"n11","sourceOutput":"m","target":"n13","targetInput":"in"}],"comments":[]}}'
const tmp_vars = '{"global":{"money":{"type":0,"value":0}}}'
const tmp_flows = '["talked_to_blacksmith","quest_active","went_to_shore","quest_completed"]';
const tmp_chars = '["blacksmith","Голос за кадром"]';

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

        if (!load_from_storage('flows'))
            save_to_storage('flows', tmp_flows)

        if (!load_from_storage('characters'))
            save_to_storage('characters', tmp_chars)
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

