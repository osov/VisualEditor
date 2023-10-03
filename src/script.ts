import { VarSet, VarTypes } from "./data_manager"



let variables: VarSet = {}
let selected_scene = ''

function default_value(type: string | number, value: string | number) {
    if (type === VarTypes.NUMBER) {
        return `<input type="number" class="value_data" value="${value}">`
    }
    else if (type === VarTypes.STRING) {
        return `<input type="text" class="value_data" value="${value}">`
    }
    else if (type === VarTypes.BOOLEAN) {
        return `
        <select class="value_data">
            <option value="0"${value === 0 ? 'selected' : ''}>Нет</option>
            <option value="1"${value === 1 ? 'selected' : ''}>Да</option>
        </select>
        `
    }
    else
        return '-'
}

function render_variables() {
    let htmlTable: string = `<table class="tbl">`
    htmlTable += `
    <tr>
        <th>Имя</th>
        <th>Тип</th>
        <th>По умолчанию</th>
        <th></th>
    </tr>`

    for (const name in variables) {
        const item = variables[name]
        htmlTable += `
        <tr class="variable__item" data-name="${name}" data-type="${item.type}" data-value="${item.value}">
            <td><input type="text" value="${name}" readonly></td>
            <td>
                <select class="select_type">
                    <option value="${VarTypes.NUMBER}"${item.type === VarTypes.NUMBER ? 'selected' : ''}>Число</option>
                    <option value="${VarTypes.STRING}"${item.type === VarTypes.STRING ? 'selected' : ''}>Строка</option>
                    <option value="${VarTypes.BOOLEAN}"${item.type === VarTypes.BOOLEAN ? 'selected' : ''}>Логическое</option>
                </select>
            </td>
            <td>${default_value(item.type, item.value)}</td>
            <td><button class="variable__remove">x</button></td>
        </tr>`

    }

    htmlTable += `</table>`
    $('.wrTableVariables').html(htmlTable)
}

function save_variables() {
    const tmp: VarSet = {};
    $(".variable__item").each(function () {
        const el = $(this);
        const t = Number(el.attr('data-type'));
        let val: string | number = el.attr('data-value')!;
        if (t != VarTypes.STRING)
            val = parseFloat(val);
        tmp[el.attr('data-name')!] = { type: t as any, value: val as any };
    })
    variables = tmp
    dataManager.set_scene_variables(selected_scene, variables);
}

function open_variables_scene(name: string) {
    selected_scene = name;
    $(".variable_scene_item").removeClass('active');
    $(`.variable_scene_item[data-name=${name}]`).addClass('active');
    $(".variables_scene_title").text(name == 'global' ? 'Глобальные переменные' : 'Переменные сцены ' + name.split('scene_')[1])
    variables = dataManager.get_scene_variables(name);
    render_variables()
}


$("body").on("click", ".add_variable", function () {
    const name = prompt('Имя переменной');
    if (!name)
        return;
    if (variables[name])
        return toastr.error('Переменная с таким именем уже есть');
    variables[name] = { type: VarTypes.STRING, value: 'строка' }
    render_variables()
    save_variables()
})

$("body").on("click", ".variable__remove", function () {
    const name = $(this).closest('.variable__item').attr("data-name")!
    delete variables[name];
    render_variables()
    save_variables()
})

$("body").on("change", ".select_type", function () {
    const tr = $(this).closest('.variable__item')
    const tdDef = tr.find("td:nth-child(3)")
    const curSel = Number($(this).val())
    const varVal = curSel === VarTypes.STRING ? '' : 0
    tdDef.html(default_value(curSel, varVal))
    tr.attr('data-type', curSel)
    tr.attr('data-value', varVal)
    save_variables()
})

$("body").on("change", ".value_data", function () {
    $(this).closest('.variable__item').attr('data-value', $(this).val() + '')
    save_variables()
})

$("body").on("keyup", ".value_data", function () {
    $(this).closest('.variable__item').attr('data-value', $(this).val() + '')
    save_variables()
})



$("body").on("click", ".debug_btn[data-id='variables']", function () {
    let html = '<a href="javascript:void(0);" class="variable_scene_item" data-name="global">Глобальные переменные</a>';
    const scenes = dataManager.get_all_scenes()
    for (let i = 0; i < scenes.length; i++) {
        let scene = scenes[i].split('scene_')[1];
        html += `<a href="javascript:void(0);" class="variable_scene_item" data-name="${scenes[i]}">- ${scene}</a>`
    }
    $('.variables_categorys').html(html);

    open_variables_scene(dataManager.get_current_scene())

    $(".mmodal").addClass("active")
})

$("body").on("click", ".open_scene", function () {
    openModule($(this).text());
})

$("body").on("click", ".new_scene", function () {
    makeModule()
})

$("body").on("click", ".del_module", function () {
    const name = prompt('Ввод имени модуля');
    if (!name)
        return;
    editor.removeModule(name);
})

$("body").on("click", ".variable_scene_item", function () {
    open_variables_scene($(this).attr('data-name')!);
})

$("body").on("click", ".mmodal__close", function () {
    $(".mmodal").removeClass("active")
})

$("body").on("click", ".switch", function () {
    var i = +$(this).index()
    var id = $(this).attr("data-sw")
    $(this)
        .parent()
        .find("[data-sw=" + id + "]")
        .removeClass("active")
    $(this).addClass("active")
    $("[data-swb=" + id + "]").hide()
    $("[data-swb=" + id + "]:eq(" + i + ")").show()
})