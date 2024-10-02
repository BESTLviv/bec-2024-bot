import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import { takeOption, menuKeyboard, backboard, takeKeyboard } from "../markups/after-registration.class";
import { UserModel } from "../database/Schema.class";
import path from "path";
import { TimeCheck } from "./timeCheck";

const myTeamMenuWizard = new Scenes.WizardScene<IBotContext>(
    'my-team-menu-wizard',
    async (ctx) => {
        const user = await UserModel.findOne({ chatId: ctx.chat?.id });
       
        if (!user?.team) {
            await ctx.replyWithPhoto(
                { source: path.join(__dirname, '../../public/team.jpg')},
                {
                    caption: "У вас нема команди, створіть свою команду або доєднайтеся до іншої команди.",
                    reply_markup: takeKeyboard.reply_markup,
                }
            );
            
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
    try{
        await TimeCheck(ctx)
        await ctx.reply('Приєднуйся до нашого чату',  Markup.inlineKeyboard([
            Markup.button.url('Тик', 'https://t.me/BEC_2024_find_team')
        ]));  
    }
    catch(error) {
        return;
    }
})
myTeamMenuWizard.hears(takeOption[2], async (ctx) => {
    await ctx.scene.enter("create-team-wizard");  
})
myTeamMenuWizard.hears(takeOption[3], async (ctx) => {
    await ctx.scene.enter("join-team-wizard");    
})

export default myTeamMenuWizard;

