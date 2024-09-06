import { Markup } from 'telegraf';

export const educationOption = ["НУЛП", "УКУ", "ЛНУ",  "КПІ", "Ще в школі", "Вже закінчив(-ла)"]
export const educationInlineButton = Markup.keyboard([
    [
        Markup.button.callback(educationOption[0], "education_nulp"),
        Markup.button.callback(educationOption[1], "education_uku")
    ],
    [
        Markup.button.callback(educationOption[2], "education_lnu"),
        Markup.button.callback(educationOption[3], "education_kpi")
    ],
    [
        Markup.button.callback(educationOption[4], "education_school"),
        Markup.button.callback(educationOption[5], "education_graduated")
    ],
]).resize().oneTime();


export const courseOption = ["Перший", "Другий", "Третій", "Четвертий", "На магістратурі", "Нічого з переліченого"]
export const courseInlineButton = Markup.keyboard([
    [
        Markup.button.callback(courseOption[0], "course_first"),
        Markup.button.callback(courseOption[1], "course_second")
    ],
    [
        Markup.button.callback(courseOption[2], "course_third"),
        Markup.button.callback(courseOption[3], "course_fourth")
    ],
    [
        Markup.button.callback(courseOption[4], "course_magistracy"),
        Markup.button.callback(courseOption[5], "course_other")
    ],
]).resize().oneTime();

export const whereOption = ["Через оголошення в університеті", "Через соц. мережі", "Черезa друзів", "Інше"]
export const whereInlineButton = Markup.keyboard([
    [
        Markup.button.callback(whereOption[0], "where_university"),
    ],    
    [
        Markup.button.callback(whereOption[1], "where_social-media"),
        Markup.button.callback(whereOption[2], "where_friend"),
    ],
    [
        Markup.button.callback(whereOption[3], "where_other")
    ]
  
]).resize().oneTime();

export const workingOption = ["Так", "Ні"]
export const workingInlineButton = Markup.keyboard([
    Markup.button.callback(workingOption[0], "working_1"),
    Markup.button.callback(workingOption[1], "working_0")
]).resize().oneTime();

export const contactOption = ['Поділитися контактом']
export const contactInlineButton = Markup.keyboard([
    Markup.button.contactRequest(contactOption[0]) // Кнопка для обміну контактом
]).resize().oneTime();

export const requestOption = ['Я погоджуюсь.']
export const requestDataInlineButton = Markup.keyboard([
    Markup.button.callback(requestOption[0], "request_true") // Кнопка для обміну контактом
]).resize().oneTime();