import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import vacancies from '../data/vacancies.json';
import { ConfigService } from "../config/config.service";
import { menuKeyboardAfterApprove, menuOptionAfterApprove } from "../markups/after-approve.markups";

const afterApproveMenuWizard = new Scenes.WizardScene<IBotContext>(
    'after-approve-menu-wizard',
    async (ctx) => {
        console.log("after-approve-menu-wizard")
        await ctx.reply("Вітаємо на Best Engineering Competition!", menuKeyboardAfterApprove);
    },

);

afterApproveMenuWizard.hears(menuOptionAfterApprove[0], async (ctx) => {
    await ctx.reply("Доступні вакансії:\n\n");
    for (const vacancy of vacancies.vacancies) {
        await ctx.reply(`${vacancy.text}\n`);
    }
});
afterApproveMenuWizard.hears(menuOptionAfterApprove[1], async (ctx) => {
     return ctx.scene.enter('more-info-menu-wizard');   
})
afterApproveMenuWizard.hears(menuOptionAfterApprove[2], async (ctx) => {
    await ctx.reply('Приєднуйся до нашого чату учасників',  Markup.inlineKeyboard([
        Markup.button.url('Тик', 'https://t.me/+r1HLUVqycngxYzZi')
    ]));   
})
afterApproveMenuWizard.hears(menuOptionAfterApprove[3], async (ctx) => {
    await ctx.reply('Ось посилання на загальну інформацію для учасників, обов\'язково прочитати!',  Markup.inlineKeyboard([
        Markup.button.url('Тик', 'https://t.me/+r1HLUVqycngxYzZi')
    ]));  
})
afterApproveMenuWizard.hears(menuOptionAfterApprove[4], async (ctx) => {
    return ctx.scene.enter('my-team-joined-menu-wizard');
})

const adminSecret = new ConfigService().get("ADMIN_WORD");
afterApproveMenuWizard.hears(adminSecret, async (ctx) => {
    return ctx.scene.enter('admin-panel-wizard');
});



export default afterApproveMenuWizard;
