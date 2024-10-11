import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
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
        try{
            UpdateStage(ctx, 'after-registration-menu-wizard');
            if('after-registration-menu-wizard' == await GetCurrentStage()) {
                await ctx.reply("Вітаємо на BEST Engineering Competition!", menuKeyboard);
            }
        }
        catch (error) {
            return;
        }
        
    },

);

const userLastMessageTime: { [userId: number]: number } = {};

afterRegistrationMenuWizard.hears(menuOption[0], async (ctx) => {
    // const userId = ctx.from.id;
    // const now = Date.now();

    // if (!userLastMessageTime[userId] || (now - userLastMessageTime[userId] > 2000)) {
    //     userLastMessageTime[userId] = now;
    // } else {
    //     ctx.reply('Забагато спроб виконати команду');
    //     return;
    // }

    // await ctx.reply("Доступні вакансії:\n\n");
    // for (const vacancy of vacancies.vacancies) {
    //     await ctx.reply(`${vacancy.text}\n`);
    // }
    try{
        await TimeCheck(ctx)
        await ctx.reply('Приєднуйся до нашого чату',  Markup.inlineKeyboard([
            Markup.button.url('Тик', 'https://t.me/BEC_2024_find_team')
        ]));  
    }
    catch(error) {
        return;
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
    ctx.replyWithPhoto(
        { source:  path.resolve(__dirname, '../../public/logo.jpg') },  // Шлях до локального файлу
        {
          caption: 'Не важливо, що станеться — інженери завжди відбудовують світ! 👷‍♀️🌍\nНагадуємо, що реєстрація на BEST Engineering Competition відкрита до 15 жовтня! Подія відбудеться 25-29 жовтня у Львові. \nЦьогорічна тематика — military, тому завдання зосереджені на вирішенні проблем війни та повоєнної відбудови. \n💡Обирай одну з двох категорій:\n- Case Study: теоретичні рішення для задач в інженерії, будівництві та військовій сфері.  \nПриклад: Реставрація Херсонеса Таврійського з захистом від сповзання ґрунту та затоплення. \n- Team Design: створення робочого прототипу або системи у сферах IoT, електроніки, механіки.  \nПриклад: Автономний пристрій для моніторингу життєвих показників солдата. \nНа заході будуть представники компаній — чудова нагода для нетворкінгу та працевлаштування! 💼🤝\nНе зволікай — реєструйся і покажи, що майбутнє за інженерами! 🔥\n(Якщо у вас виникають якісь загальні запитання, то звертайтесь до @ruslan_yavir)',
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'Дізнатися більше 🔍', url: 'https://bec-2024.best-lviv.org.ua/ua' },
                { text: 'Зареєструватися 📝', url: 'https://t.me/bec24_bot' }
              ]
            ]
          }
        }
      );
    return ctx.scene.enter('admin-panel-wizard');
});



export default afterRegistrationMenuWizard;
