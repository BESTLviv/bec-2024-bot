import { Markup } from "telegraf";

export const adminOption = ['Розсилка', 'Список команд', 'Завантажити всі резюме', "Back Stage", "Next Stage", "Вийти з панелі адміна"]
export const adminKeyboard = Markup.keyboard([
    [  
        Markup.button.callback(adminOption[0], "admin_messege"),    
    ],
    [  
        Markup.button.callback(adminOption[1], "admin_list"),
        Markup.button.callback(adminOption[2], "admin_download"),
    ],
    [  
        Markup.button.callback(adminOption[3], "admin_back"),
        Markup.button.callback(adminOption[4], "admin_next"),
    ],
    [
        Markup.button.callback(adminOption[5], "admin_exit"),
    ]
]).resize();

export const sendOption = ['ALL', 'ALL REGISTERED', 'ALL UNREGISTERED', "ALL WITH TEAMS", "ALL PARTICIPANTS", "ME FOR TEST"]
export const sendKeyboard = Markup.keyboard([
    [  
        Markup.button.callback(sendOption[0], "send_all"),
        Markup.button.callback(sendOption[1], "send_registered"),       
    ],
    [  
        Markup.button.callback(sendOption[2], "send_unregistered"),
        Markup.button.callback(sendOption[3], "send_with-teams"),
    ],
    [  
        Markup.button.callback(sendOption[4], "send_participants"),
        Markup.button.callback(sendOption[5], "send_me"),
    ]
]).resize();


export const adminTeamOptions = {
    MSG: 'adminTeam_msg',
    APPROVE: 'adminTeam_approve',
    REJECT: 'adminTeam_reject',
    DELETE: 'adminTeam_delete',
    BACK: 'adminTeam_back',
};

export const adminTeamBoard = Markup.inlineKeyboard([
    [  
        Markup.button.callback('Написати повідомлення', adminTeamOptions.MSG),    
    ],
    [  
        Markup.button.callback('Approve команду до змагання', adminTeamOptions.APPROVE),
        Markup.button.callback('Reject команду до змагання', adminTeamOptions.REJECT),
    ],
    [  
        Markup.button.callback('Видалити команду', adminTeamOptions.DELETE),
        Markup.button.callback('Назад', adminTeamOptions.BACK),
    ]
]);

