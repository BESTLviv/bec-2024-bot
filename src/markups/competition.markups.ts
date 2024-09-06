import { Markup } from "telegraf";

export const menuOptionCompetition = ['Вакансії', 'Більше інформації про BEC', "Чат для учасників івену", "Загальна інформація для учасників", "Розклад", 'Моя команда']
export const menuKeyboardCompetition = Markup.keyboard([
    [  
        Markup.button.callback(menuOptionCompetition[0], "menu_vacancies"),
        Markup.button.callback(menuOptionCompetition[1], "menu_more-info"),
    ],
    [  
        Markup.button.callback(menuOptionCompetition[2], "menu_chat"),
        Markup.button.callback(menuOptionCompetition[3], "menu_surviv"),
    ],
    [  
        Markup.button.callback(menuOptionCompetition[4], "menu_schedule"),
        Markup.button.callback(menuOptionCompetition[5], "menu_my-team"),
    ],

]).resize();

export const teamCompetitionOption = ["Назад", "Додати своє CV", "Основне завдання",  "Команді потрібна допомога"]
export const teamCompetitionboard = Markup.keyboard([
    [  
        Markup.button.callback(teamCompetitionOption[0], "team-profile_back"),
        Markup.button.callback(teamCompetitionOption[1], "team-profile_add-repo"),
    ],
    [
        Markup.button.callback(teamCompetitionOption[2], "team-profile_change-technologyList"),
        Markup.button.callback(teamCompetitionOption[3], "team-profile_add-cv"),
    ],

]).resize();