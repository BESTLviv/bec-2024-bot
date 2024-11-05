import { Message } from "telegraf/typings/core/types/typegram";
import { IBotContext } from "../context/context.interface";
import { IUser } from "../database/Schema.class";
import { isTextMessage, isPhotoMessage, isDocumentMessage } from "./generaly-utils.functions";



export async function sendMessage(ctx: IBotContext, users: any[], inputMessage: Message) {
    try {
        if (ctx.chat) {
            if (isTextMessage(inputMessage)) {
                const message = inputMessage.text.trim();

                // Мапимо всі запити з затримкою
                const sendTasks = users.map(async (user) => {
                    if (user?.chatId) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 300)); // Затримка 300 мс
                            await ctx.telegram.sendMessage(user.chatId, message);
                        } catch (error) {
                            console.warn(`Не вдалося надіслати повідомлення для ${user?.userName}:`, error);
                        }
                    } else {
                        console.warn(`chatId відсутній для користувача ${user?.userName}`);
                    }
                });

                await Promise.all(sendTasks);
                await ctx.reply("Повідомлення було надіслано!");
            } else if (isPhotoMessage(inputMessage)) {
                const photo = inputMessage.photo[inputMessage.photo.length - 1].file_id; 
                const caption = inputMessage.caption || '';

                const sendTasks = users.map(async (user) => {
                    if (user?.chatId) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 300)); // Затримка 300 мс
                            await ctx.telegram.sendPhoto(user.chatId, photo, { caption });
                        } catch (error) {
                            console.warn(`Не вдалося надіслати фото для ${user?.userName}:`, error);
                        }
                    } else {
                        console.warn(`chatId відсутній для користувача ${user?.userName}`);
                    }
                });

                await Promise.all(sendTasks);
                await ctx.reply("Фото було надіслано!");
            } else if (isDocumentMessage(inputMessage)) {
                const document = inputMessage.document.file_id;
                const caption = inputMessage.caption || '';

                const sendTasks = users.map(async (user) => {
                    if (user?.chatId) {
                        try {
                            await new Promise(resolve => setTimeout(resolve, 300)); // Затримка 300 мс
                            await ctx.telegram.sendDocument(user.chatId, document, { caption });
                        } catch (error) {
                            console.warn(`Не вдалося надіслати документ для ${user?.userName}:`, error);
                        }
                    } else {
                        console.warn(`chatId відсутній для користувача ${user?.userName}`);
                    }
                });

                await Promise.all(sendTasks);
                await ctx.reply("Документ було надіслано!");
            } else {
                await ctx.reply("Невідомий тип повідомлення. Спробуйте ще раз.");
            }
        }
    } catch (error) {
        console.error("Помилка надсилання повідомлень:", error);
    }
}


export function wrapStringAsMessage(text: string): Message.TextMessage {
    return {
        message_id: Math.floor(Math.random() * 100000), // Випадковий message_id
        from: {
            id: 1111,
            is_bot: true,
            first_name: 'Bot',
            username: 'bot',
        },
        chat: {
            id: 1111,
            type: 'private',
            first_name: 'Bot',
            username: 'bot',
        },
        date: Math.floor(Date.now() / 1000), // Поточний UNIX timestamp
        text: text,
    };
}