
import { IBotContext } from "../context/context.interface";
import { Context, Telegraf } from "telegraf";
import { Section } from "./section.interface";
import { menuKeyboard, infoKeyboard } from "../markups/after-registration.class";
import { menuOption, infoOption } from "../markups/after-registration.class";
import data from '../data/vacancies.json';
import LocalSession from "telegraf-session-local";
export class AfterRegistrationSection implements Section {

    ctx: IBotContext;
    bot: Telegraf<IBotContext>;
  
    constructor(ctx: IBotContext, bot: Telegraf<IBotContext>) {
        this.ctx = ctx;
        this.bot = bot;
    }

    handle() {
        if (this.ctx.chat) {
            this.registerListeners()
            this.ctx.reply("Вітаємо на Best Engineering Competition!", menuKeyboard)
        }
    }


    registerListeners() {
  
        this.bot.hears(menuOption[0], async (ctx) => {
            await this.ctx.reply("Доступні вакансії:\n\n");
            data.vacancies.forEach(async (vacancy)  => {
                await this.ctx.reply(`${vacancy.text}\n`);
            });   
        })

        this.bot.hears(menuOption[1], async (ctx) => {
            await this.ctx.reply("BEC’2024 - це щорічні інженерні змагання, організовані BEST Lviv. Ви можете обрати категорію, що більше до душі і зареєструватися тут (лінк на ʼвзяти участьʼ)", infoKeyboard);
           
        })
    }
}