import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import { menuKeyboard } from "../markups/after-registration.class";
import { menuOption } from "../markups/after-registration.class";
import vacancies from '../data/vacancies.json';
import { ConfigService } from "../config/config.service";
import { menuKeyboardAfterApprove, menuOptionAfterApprove } from "../markups/after-approve.markups";
import { menuKeyboardCompetition, menuOptionCompetition } from "../markups/competition.markups";
import { UpdateStage } from "../utils/update-stage";
import { GetCurrentStage } from "../utils/get-current-stage";

const competitionMenuWizard = new Scenes.WizardScene<IBotContext>(
    'competition-menu-wizard',
    async (ctx) => {
        console.log("competition-menu-wizard")
        UpdateStage(ctx, 'competition-menu-wizard');
        if('competition-menu-wizard' == await GetCurrentStage()) {
            await ctx.reply("Вітаємо на Best Engineering Competition!", menuKeyboardCompetition);
        }
    },

);

competitionMenuWizard.hears(menuOptionCompetition[0], async (ctx) => {
    await ctx.reply("Доступні вакансії:\n\n");
    for (const vacancy of vacancies.vacancies) {
        await ctx.reply(`${vacancy.text}\n`);
    }
});
competitionMenuWizard.hears(menuOptionCompetition[1], async (ctx) => {
     return ctx.scene.enter('more-info-menu-wizard');   
})
competitionMenuWizard.hears(menuOptionCompetition[2], async (ctx) => {
    await ctx.reply('Приєднуйся до нашого чату учасників',  Markup.inlineKeyboard([
        Markup.button.url('Тик', 'https://t.me/+r1HLUVqycngxYzZi')
    ]));   
})
// competitionMenuWizard.hears(menuOptionCompetition[3], async (ctx) => {
//     await ctx.reply('Ось посилання на загальну інформацію для учасників, обов\'язково прочитати!',  Markup.inlineKeyboard([
//         Markup.button.url('Тик', 'https://t.me/+r1HLUVqycngxYzZi')
//     ]));  
// })
// competitionMenuWizard.hears(menuOptionCompetition[4], async (ctx) => {
//     await ctx.sendPhoto({ source: './public/WhatIsBest.jpg' })
// })
competitionMenuWizard.hears(menuOptionCompetition[3], async (ctx) => {
    return ctx.scene.enter('my-team-joined-menu-wizard');
})

const adminSecret = new ConfigService().get("ADMIN_WORD");
competitionMenuWizard.hears(adminSecret, async (ctx) => {
    return ctx.scene.enter('admin-panel-wizard');
});



export default competitionMenuWizard;
