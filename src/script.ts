let variables = [
    {
        id: 1,
        name: 'name 01',
        type: 1,
        value: 123
    },
    {
        id: 2,
        name: 'name 02',
        type: 2,
        value: 'str 123456'
    },
    {
        id: 3,
        name: 'name 03',
        type: 3,
        value: 1
    }
];

function defaultValue(type: string | number, value: string | number){
    if(type === 1){
        return `<input type="number" data-value value="${value}">`
    }
    else if(type === 2){
        return `<input type="text" data-value value="${value}">`
    }
    else {
        return `
        <select data-value>
            <option value="0"${value === 0 ? 'selected' : ''}>False</option>
            <option value="1"${value === 1 ? 'selected' : ''}>True</option>
        </select>
        `
    }
}

function render_variables(){
    let htmlTable:string = `<table class="tbl">`
    htmlTable += `
    <tr>
        <th>name</th>
        <th>type</th>
        <th>default</th>
        <th></th>
        <th></th>
    </tr>`
    
    variables.forEach(item => {
        htmlTable += `
        <tr class="variable__item" data-id="${item.id}">
            <td><input type="text" data-name="${item.name}" value="${item.name}"></td>
            <td>
                <select class="select_type">
                    <option value="1"${item.type === 1 ? 'selected' : ''}>Number</option>
                    <option value="2"${item.type === 2 ? 'selected' : ''}>String</option>
                    <option value="3"${item.type === 3 ? 'selected' : ''}>Boolean</option>
                </select>
            </td>
            <td>${defaultValue(item.type, item.value)}</td>
            <td><button class="variable__remove">x</button></td>
            <td><button class="variable__save">save</button></td>
        </tr>`

    })

    htmlTable += `</table>`
    $('.wrTableVariables').html(htmlTable) 
}

$("body").on("change", ".select_type", function () {
    // const idVar = Number($(this).closest('.variable__item').attr("data-id"))
    // variables.forEach(item => {
    //     if(item.id === idVar){
    //         item.type = Number($(this).val())
    //         item.value = item.type === 2 ? 'str' : 1
    //     }
    // });
    // render_variables()  
    const tr = $(this).closest('.variable__item')
    const tdDef = tr.find("td:nth-child(3)")
    const curSel = Number($(this).val())
    const varVal = curSel === 2 ? 'str' : 1
    tdDef.html(defaultValue(curSel, varVal))
})

$("body").on("click", ".addVariable", function () {
    variables.push({
        id: variables.length + 1,
        name: 'name new',
        type: 1,
        value: 123
    })
    render_variables()
})

$("body").on("click", ".variable__remove", function () {
    const idVar = Number($(this).closest('.variable__item').attr("data-id"))
    variables = variables.filter(item => item.id !== idVar);
    render_variables()
})

$("body").on("click", ".variable__save", function () {
    const tr = $(this).closest('.variable__item')
    const idVar = Number(tr.attr("data-id"))

    const val = tr.find("[data-value]").val()
    variables.forEach(item => {
        if(item.id === idVar){
            item.name = String(tr.find("input[data-name]").val())
            item.type = Number(tr.find(".select_type").val())
            item.value = typeof val === 'string' ? String(val) : Number(val) 
        }
    });

    render_variables()
})


$("body").on("click", ".open_mmodal", function () {
    render_variables()
    $(".mmodal").addClass("active")
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