
declare global {
    const log: (..._args: any) => void
    const error: (..._args: any) => void
    const json: ReturnType<typeof json_fake>
    const math: ReturnType<typeof math_fake>
    const tonumber: (s: string) => number
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

function math_fake() {

    function get_random_int(min: number, max: number) {
        const minCeiled = Math.ceil(min);
        const maxFloored = Math.floor(max);
        return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // The maximum is inclusive and the minimum is inclusive
    }

    function random(a: number, b: number) {
        return get_random_int(a, b);
    }

    return { random }
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
    (window as any).log = (..._args: any) => { console.log(get_args_str(..._args)); debugEditor.add_log(get_args_str(..._args)) }
    (window as any).error = (..._args: any) => console.error(get_args_str(..._args));
    (window as any).json = json_fake();
    (window as any).math = math_fake();
    (window as any).tonumber = (s: string) => Number(s);
}