import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import { takeOption, menuKeyboard, backboard, takeKeyboard } from "../markups/after-registration.class";
import { UserModel } from "../database/Schema.class";

const myTeamMenuWizard = new Scenes.WizardScene<IBotContext>(
    'my-team-menu-wizard',
    async (ctx) => {
        const user = await UserModel.findOne({ chatId: ctx.chat?.id });
        if (!user?.team) {
            await ctx.reply("Ви не маєте команди", takeKeyboard);   
        }
        else {
            await ctx.scene.enter("my-team-joined-menu-wizard");  
        }
    }
);

myTeamMenuWizard.hears(takeOption[0], async (ctx) => {
    return ctx.scene.enter('after-registration-menu-wizard');  
})
myTeamMenuWizard.hears(takeOption[1], async (ctx) => {
    await ctx.reply('Приєднуйся до нашого чату',  Markup.inlineKeyboard([
        Markup.button.url('Тик', 'https://t.me/BEC_2024_find_team')
    ]));  
})
myTeamMenuWizard.hears(takeOption[2], async (ctx) => {
    await ctx.scene.enter("create-team-wizard");  
})
myTeamMenuWizard.hears(takeOption[3], async (ctx) => {
    await ctx.scene.enter("join-team-wizard");    
})

export default myTeamMenuWizard;

