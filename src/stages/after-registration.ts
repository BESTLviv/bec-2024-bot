import { IBotContext } from "../context/context.interface";
import { Scenes } from "telegraf";
import { menuKeyboard } from "../markups/after-registration.class";
import { menuOption } from "../markups/after-registration.class";
import vacancies from '../data/vacancies.json';
import { ConfigService } from "../config/config.service";
import { GetCurrentStage } from "../utils/get-current-stage";
import { UpdateStage } from "../utils/update-stage";
import path from "path";
import { TimeCheck } from "../utils/timeCheck";
import { Bot } from "../app";


const afterRegistrationMenuWizard = new Scenes.WizardScene<IBotContext>(
    'after-registration-menu-wizard',
    async (ctx) => {
        UpdateStage(ctx, 'after-registration-menu-wizard');
        if('after-registration-menu-wizard' == await GetCurrentStage()) {
            await ctx.reply("Вітаємо на Best Engineering Competition!", menuKeyboard);
        }
    },

);

const userLastMessageTime: { [userId: number]: number } = {};

afterRegistrationMenuWizard.hears(menuOption[0], async (ctx) => {
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
afterRegistrationMenuWizard.hears(menuOption[1], async (ctx) => {
     return ctx.scene.enter('more-info-menu-wizard');   
})
afterRegistrationMenuWizard.hears(menuOption[2], async (ctx) => {
    return ctx.scene.enter('my-team-menu-wizard');
})

const adminSecret = new ConfigService().get("ADMIN_WORD");
afterRegistrationMenuWizard.hears(adminSecret, async (ctx) => {
    return ctx.scene.enter('admin-panel-wizard');
});



export default afterRegistrationMenuWizard;
