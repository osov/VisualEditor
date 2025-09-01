
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


export function register_lua_types() {
    (window as any).log = (..._args: any) => { console.log(get_args_str(..._args)); debugEditor.add_log(get_args_str(..._args)) }
    (window as any).error = (..._args: any) => console.error(get_args_str(..._args));
}