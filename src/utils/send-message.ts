import { Message } from "telegraf/typings/core/types/typegram";
import { IBotContext } from "../context/context.interface";
import { IUser } from "../database/Schema.class";
import { isTextMessage, isPhotoMessage, isDocumentMessage } from "./generaly-utils.functions";

export async function sendMessage(ctx: IBotContext, users: any[], inputMessage: Message) {
    try{
        if (ctx.chat) {
            if (isTextMessage(inputMessage)) {
                const message = inputMessage.text.trim();
                for (const user of users) {
                    try{
                        if (user?.chatId) {
                            await ctx.telegram.sendMessage(user.chatId, message);
                        } else {
                            console.warn(`chatId відсутній для користувача ${user?.userName}`);
                        }
                    }
                    catch (error) {
                        return;
                    }

                    
                }
                await ctx.reply("Повідомлення було надіслано!");
            } 
            else if (isPhotoMessage(inputMessage)) {
                try{
                    const photo = inputMessage.photo[inputMessage.photo.length - 1].file_id; 
                const caption = inputMessage.caption || '';
                for (const user of users) {
                    if (user?.chatId) {
                        await ctx.telegram.sendPhoto(user.chatId, photo, { caption });
                    } else {
                        console.warn(`chatId відсутній для користувача ${user?.userName}`);
                    }
                }
                await ctx.reply("Фото було надіслано!");
                }
                catch (error) {
                    return;
                }
                
            } 
            else if (isDocumentMessage(inputMessage)) {
                try{
                    const document = inputMessage.document.file_id;
                    const caption = inputMessage.caption || '';
                    for (const user of users) {
                        if (user?.chatId) {
                            await ctx.telegram.sendDocument(user.chatId, document, { caption });
                        } else {
                            console.warn(`chatId відсутній для користувача ${user?.userName}`);
                        }
                    }
                    await ctx.reply("Документ було надіслано!");
                }
                catch (error) {
                    return;
                }
               
            } 
            else {
                await ctx.reply("Невідомий тип повідомлення. Спробуйте ще раз.");
            }
        }    
    }
    catch (error) {
        return;
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