import { Markup } from "telegraf";

export const menuOptionAfterApprove = ['Вакансії', 'Більше інформації про BEC', "Чат для учасників івену", "Загальна інформація для учасників", 'Моя команда']
export const menuKeyboardAfterApprove = Markup.keyboard([
    [  
        Markup.button.callback(menuOptionAfterApprove[0], "menu_vacancies"),
        Markup.button.callback(menuOptionAfterApprove[1], "menu_more-info"),
    ],
    [  
        Markup.button.callback(menuOptionAfterApprove[2], "menu_chat"),
        Markup.button.callback(menuOptionAfterApprove[3], "menu_surviv"),
    ],
    [  
        Markup.button.callback(menuOptionAfterApprove[4], "menu_my-team"),
    ],

]).resize();
