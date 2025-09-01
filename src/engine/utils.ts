
declare global {
    const log: (..._args: any) => void
    const error: (..._args: any) => void
}


function get_args_str(..._args: any) {
    let str = '';
    for (const k in _args) {
        const a = _args[k];
        if (typeof a == 'object') {
            str += JSON.stringify(a) + ', ';
        }
        else
            str += a + ', ';
    }
    if (str != '')
        str = str.substr(0, str.length - 2);
    return str
}

export function add_tabs_to_text(text: string, num: number) {
    const lines = text.split('\n');
    return lines.map(l => '\t'.repeat(num) + l).join('\n');
}

export function remove_empty_lines(str: string) {
    const lines = str.split('\n');
    return lines.filter(l => l.trim() != '').join('\n');
}


export function register_system() {
    (window as any).log = (..._args: any) => { console.log(get_args_str(..._args)); debugEditor.add_log(get_args_str(..._args)) }
    (window as any).error = (..._args: any) => console.error(get_args_str(..._args));
}