import { Markup } from "telegraf";

export const postEventOption = ['Нас підтримували', 'Переможці івенту', 'Фідбек-форма']
export const postEventKeyboard = Markup.keyboard([ 
        Markup.button.callback(postEventOption[0], "post-event_partners"),
        Markup.button.callback(postEventOption[1], "post-event_winners"),       
        Markup.button.callback(postEventOption[2], "post-event_fidback"),
]).resize();