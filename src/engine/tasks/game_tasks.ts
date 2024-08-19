import { ITaskInfo } from "../types";

export const game_tasks: { [k: string]: ITaskInfo } = {
    'OnCharClick': {
        in_actions: [],
        in_data: [],
        out_actions: ['out'],
        out_data: [],
        run: (data, __, call_action) => {
            gameState.register_event_on_character_click(data.id, () => call_action('out'));
        },
    },
    'CloseDialog': {
        in_actions: ['in'],
        in_data: [],
        out_actions: [],
        out_data: [],
        run: () => {
            gameState.close_dialog();
        },
    },
    'Dialog': {
        in_actions: ['in'],
        in_data: ['in_text', 'in0', 'in1', 'in2', 'in3', 'in4',],
        out_actions: ['out0', 'out1', 'out2', 'out3', 'out4'],
        out_data: [],
        run: (data, get_in_data, call_action) => {
            const si = data.si as string;
            const user = data.user as string;
            let text = data.text as string;
            const tmp_answers = data.answers as string[];
            const answers = [];
            const in_data = get_in_data();
            for (let i = 0; i < tmp_answers.length; i++) {
                let answer = tmp_answers[i];
                // если это базовый диалог
                if (si == '') {
                    if (answer != '')
                        answers.push({ id: i, answer });
                }
                // если это доступность ответов, то проверяем а доступно ли
                else if (si == 'b') {
                    if (in_data['in' + i] == true && answer != '')
                        answers.push({ id: i, answer });
                }
                // если это ответ с переменными
                else if (si == 's') {
                    if (in_data['in_text'] != null)
                        text = in_data['in_text'];
                    // если что-то есть во входе
                    if (in_data['in' + i] != null)
                        answer = in_data['in' + i];
                    if (answer != '')
                        answers.push({ id: i, answer });
                }
                // если это минимальный
                else if (si == 'mi') {
                    // если что-то есть во входе
                    if (in_data['in' + i] != null)
                        answer = in_data['in' + i];
                    if (answer != '')
                        answers.push({ id: i, answer });
                }
            }
            gameState.open_dialog(user, text, answers, (id) => call_action('out' + id));
        },
    },

}