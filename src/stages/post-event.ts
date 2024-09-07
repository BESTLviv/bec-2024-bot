import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import vacancies from '../data/vacancies.json';
import { ConfigService } from "../config/config.service";
import { postEventKeyboard, postEventOption } from "../markups/post-event.markups";


const afterEventWizard = new Scenes.WizardScene<IBotContext>(
    'post-event-menu-wizard',
    async (ctx) => {
        await ctx.reply("Вітаємо на Best Engineering Competition! Кінець");
    },

);

// afterEventWizard.hears(postEventOption[0], async (ctx) => {
//     await ctx.reply("Доступні вакансії:\n\n");
//     for (const vacancy of vacancies.vacancies) {
//         await ctx.reply(`${vacancy.text}\n`);
//     }
// });
// afterEventWizard.hears(postEventOption[1], async (ctx) => {
//     return ctx.scene.enter('more-info-menu-wizard');   
// })
// afterEventWizard.hears(postEventOption[2], async (ctx) => {
//     await ctx.reply('Ось посилання на фідбек-форму, ваш відгук буде дуже корисним для нас!',  Markup.inlineKeyboard([
//         Markup.button.url('Тик', 'https://t.me/+r1HLUVqycngxYzZi')
//     ]));   
// })
// afterEventWizard.hears(postEventOption[3], async (ctx) => {
//     await ctx.reply('Ось посилання на загальну інформацію для учасників, обов\'язково прочитати!',  Markup.inlineKeyboard([
//         Markup.button.url('Тик', 'https://t.me/+r1HLUVqycngxYzZi')
//     ]));  
// })


const adminSecret = new ConfigService().get("ADMIN_WORD");
afterEventWizard.hears(adminSecret, async (ctx) => {
    return ctx.scene.enter('admin-panel-wizard');
});



export default afterEventWizard;
