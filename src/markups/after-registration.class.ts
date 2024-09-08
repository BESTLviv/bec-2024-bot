import { Markup } from "telegraf";

export const menuOption = ['Вакансії', 'Більше інформації про BEC', 'Моя команда']
export const menuKeyboard = Markup.keyboard([
    [  
        Markup.button.callback(menuOption[0], "menu_vacancies"),
        Markup.button.callback(menuOption[1], "menu_more-info"),
    ],
    [  
        Markup.button.callback(menuOption[2], "menu_my-team"),
        // Markup.button.callback(menuOption[3], "menu_take-part"),
    ],

]).resize();

export const infoOption = ['Назад', 'Категорії', 'Дата і місце проведення', 'Правила', "Організатори"]
export const infoKeyboard = Markup.keyboard([
    [  
        Markup.button.callback(infoOption[0], "info_back"),
        Markup.button.callback(infoOption[1], "info_date"),
    ],
    [  
        Markup.button.callback(infoOption[2], "info_categories"),
        Markup.button.callback(infoOption[3], "info_rules"),
    ],
    [
        Markup.button.callback(infoOption[4], "info_organizers"),
    ]

]).resize();

export const takeOption = ['Назад', 'Знайти команду', 'Створити команду', 'Долучитися до команди']
export const takeKeyboard = Markup.keyboard([
    [  
        Markup.button.callback(takeOption[0], "take_back"),
        Markup.button.callback(takeOption[1], "take_find"),
    ],
    [  
        Markup.button.callback(takeOption[2], "take_myteam"),
        Markup.button.callback(takeOption[3], "take_join"),
    ],

]).resize();

export const backOption = ['Назад']
export const backboard = Markup.keyboard([
    [  
        Markup.button.callback(takeOption[0], "back"),
    ],

]).resize();

export const categoriesOption = ["Team Design", "Case Study"]
export const categoriesboard = Markup.keyboard([
    [  
        Markup.button.callback(categoriesOption[0], "categories_td"),
        Markup.button.callback(categoriesOption[1], "categories_cs"),
    ],

]).resize();

export const teamProfileOption = ["Назад", "Додати ваше виконане тестове завдання", "Змінити список технологій команди", "Додати своє CV", "Тестове завдання",  "Покинути команду"]
export const teamProfileboard = Markup.keyboard([
    [  
        Markup.button.callback(teamProfileOption[0], "team-profile_back"),
        Markup.button.callback(teamProfileOption[1], "team-profile_add-repo"),
    ],
    [
        Markup.button.callback(teamProfileOption[2], "team-profile_change-technologyList"),
        Markup.button.callback(teamProfileOption[3], "team-profile_add-cv"),
    ],
    [
        Markup.button.callback(teamProfileOption[4], "team-profile_test-task"),
        Markup.button.callback(teamProfileOption[5], "team-profile_leave"),
    ],

]).resize();
export const teamCompetitionOption = ["Назад",  "Команді потрібна допомога", "Додати своє CV",]
export const teamProfileAfterApprove = Markup.keyboard([
    [  
        Markup.button.callback(teamCompetitionOption[0], "team-profile_back"),
    ],
    [
        Markup.button.callback(teamCompetitionOption[1], "team-profile_help"),
    ],
    [
        Markup.button.callback(teamCompetitionOption[2], "team-profile_add-cv"),
    ],


]).resize();