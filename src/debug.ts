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

    return { is_active, clear_nodes_animation, activate_node_animation, update_flow_status }
}

export function init_debug() {
    (window as any).debugEditor = DebugEditor();
}