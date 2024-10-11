import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import vacancies from '../data/vacancies.json';
import { ConfigService } from "../config/config.service";
import { menuKeyboardAfterApprove, menuOptionAfterApprove } from "../markups/after-approve.markups";
import { UpdateStage } from "../utils/update-stage";
import { GetCurrentStage } from "../utils/get-current-stage";
import { UserModel, teamModel } from "../database/Schema.class";
import path from "path";
import { TimeCheck } from "../utils/timeCheck";

const afterApproveMenuWizard = new Scenes.WizardScene<IBotContext>(
    'after-approve-menu-wizard',
    async (ctx) => {
        try{
            UpdateStage(ctx, "after-approve-menu-wizard");
            if(ctx.chat) {  
                const user = await UserModel.findOne({ chatId: ctx.chat?.id });
                const team = await teamModel.findById(user?.team)
                if( team && team.isApprove) {
                    if('after-approve-menu-wizard' == await GetCurrentStage()) {
                        await ctx.reply("Вітаємо на BEST Engineering Competition!", menuKeyboardAfterApprove);
                    }
                }
                else {
                    await ctx.reply("На жаль, ви не перейшли на наступний етап", );
                }
            }
        }
        catch (error) {
            return;
        }
        
    },

);

const userLastMessageTime: { [userId: number]: number } = {};

afterApproveMenuWizard.hears(menuOptionAfterApprove[0], async (ctx) => {

    const userId = ctx.from.id;
    const now = Date.now();

    if (!userLastMessageTime[userId] || (now - userLastMessageTime[userId] > 2000)) {
        userLastMessageTime[userId] = now;
    } else {
        ctx.reply('Забагато спроб виконати команду');
        return;
    }

    await ctx.reply("Доступні вакансії:\n\n");
    for (const vacancy of vacancies.vacancies) {
        await ctx.reply(`${vacancy.text}\n`);
    }
});
afterApproveMenuWizard.hears(menuOptionAfterApprove[1], async (ctx) => {
     return ctx.scene.enter('more-info-menu-wizard');   
})
afterApproveMenuWizard.hears(menuOptionAfterApprove[2], async (ctx) => {
    try{
        await TimeCheck(ctx)
        await ctx.reply('Запрошуємо до спілкування з іншими учасниками 😋',  Markup.inlineKeyboard([
            Markup.button.url('Тик', 'https://t.me/+r1HLUVqycngxYzZi')
        ]));   
    }
    catch(error) {
        return;
    }
    
})
// afterApproveMenuWizard.hears(menuOptionAfterApprove[3], async (ctx) => {
//     await ctx.reply('Ось посилання на загальну інформацію для учасників, обов\'язково прочитати!',  Markup.inlineKeyboard([
//         Markup.button.url('Тик', 'https://t.me/+r1HLUVqycngxYzZi')
//     ]));  
// })
afterApproveMenuWizard.hears(menuOptionAfterApprove[3], async (ctx) => {
    return ctx.scene.enter('my-team-joined-menu-wizard');
})

const adminSecret = new ConfigService().get("ADMIN_WORD");
afterApproveMenuWizard.hears(adminSecret, async (ctx) => {
    return ctx.scene.enter('admin-panel-wizard');
});



// afterApproveMenuWizard.on('text', (ctx) => {
//     const userId = ctx.from.id;
//     const now = Date.now();

//     if (!userLastMessageTime[userId] || (now - userLastMessageTime[userId] > 2000)) {
//         userLastMessageTime[userId] = now;
//     } else {
//         ctx.reply('Забагато спроб виконати команду');
//     }
// });




export default afterApproveMenuWizard;
