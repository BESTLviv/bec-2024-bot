import { IBotContext } from "../context/context.interface";
import { UserModel } from "../database/Schema.class";
import { Context, Scenes, Telegraf } from "telegraf"; // Не забудьте імпортувати Scenes, якщо воно використовується
import { bot } from "../app";
import { Bot } from "../app";
export async function UpdateStage(ctx: IBotContext) {
    Bot.resetStart()
    // try {
    //     // Отримуємо всіх користувачів з бази даних
    //     const users = await UserModel.find({});

    //     if (!users || users.length === 0) {
    //         console.log("Користувачів не знайдено");
    //         return;
    //     }

    //    // Проходимо по кожному користувачу
    //    for (const user of users) {
    //     console.log(user)
    //     // Перевіряємо, що chatId визначений і є числом або рядком
    //     if (user.chatId !== null && user.chatId !== undefined) {
    //         await ctx.reply("йес")
    //         await bot.telegram.sendMessage(user.chatId, '/start');
    //     } else {
    //         await ctx.reply("no")
    //     }

    // }

    //     console.log("Команда /start успішно виконана для всіх користувачів.");
    // } catch (error) {
    //     console.error("Помилка при відправці команди /start для користувачів:", error);
    // }
}
