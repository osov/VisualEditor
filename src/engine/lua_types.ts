
declare global {
    const json: ReturnType<typeof json_fake>
    const log: (..._args: any) => void
    const error: (..._args: any) => void
}

function json_fake() {
    function encode(data: any) {
        return JSON.stringify(data)
    }

    function decode(s: string) {
        return JSON.parse(s)
    }

    return { encode, decode }
}

function get_args_str(..._args: any) {
    let str = '';
    for (const k in _args) {
        const a = _args[k];
        if (typeof a == 'object') {
            str += json.encode(a) + ', ';
        }
        else
            str += a + ', ';
    }
    if (str != '')
        str = str.substr(0, str.length - 2);
    return str
}


export function register_lua_types() {
    (window as any).json = json_fake();
    (window as any).log = (..._args: any) => console.log(get_args_str(..._args));
    (window as any).error = (..._args: any) => console.error(get_args_str(..._args));
}