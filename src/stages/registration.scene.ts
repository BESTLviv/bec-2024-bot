import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import { educationInlineButton, courseInlineButton, contactInlineButton, workingInlineButton, requestDataInlineButton, whereInlineButton } from "../markups/registration.markups";
import { UserModel } from "../database/Schema.class";
import { courseOption, whereOption, workingOption, requestOption } from "../markups/registration.markups";
import { isContactMessage } from "../utils/generaly-utils.functions";

function isTextMessage(message: any): message is { text: string } {
    return message && message.text !== undefined;
}



const registrationWizard = new Scenes.WizardScene<IBotContext>(
    'registration-wizard',
    
    async (ctx) => {
        ctx.session.subInfo = ctx.session.subInfo || {};
        await ctx.reply('Привіт, давай знайомитися!');
        await ctx.reply('Введіть ваш вік:');
        return ctx.wizard.next();
    },

    async (ctx) => {
        if (isTextMessage(ctx.message)) {
            const age = parseInt(ctx.message.text);
            if (isNaN(age) || age < 1 || age > 100) {
                await ctx.reply('Будь ласка, введіть коректний вік');
                return;
            } 
            ctx.session.subInfo.age = age;
            await ctx.reply("Поважна цифра😎");
            await ctx.reply("Де вчишся? Вибери або просто введи", educationInlineButton);
            return ctx.wizard.next();
        } else {
            await ctx.reply('Будь ласка, введіть числове значення для віку.');
        }
    },

    async (ctx) => {
        if (isTextMessage(ctx.message)) {
            const education = ctx.message.text.trim();
            if (!education) {
                await ctx.reply('Будь ласка, введіть коректне місце навчання');
                return;
            } 
            ctx.session.subInfo.education = education;
            await ctx.reply('На якій спеціальності навчаєшся?', Markup.removeKeyboard());
            return ctx.wizard.next();
        } else {
            await ctx.reply('Будь ласка, введіть ваше місце навчання.');
        }
    },

    async (ctx) => {
        if (isTextMessage(ctx.message)) {
            const specialization = ctx.message.text.trim();
            if (!specialization) {
                await ctx.reply('Будь ласка, введіть коректну спеціальність.');
                return;
            } 
            ctx.session.subInfo.specialization = specialization;
            await ctx.reply('Крутий вибір!');
            await ctx.reply('А на якому курсі зараз?', courseInlineButton);
            return ctx.wizard.next();
        } else {
            await ctx.reply('На якій спеціальності навчаєшся?');
        }
    },

    async (ctx) => {
        if (isTextMessage(ctx.message)) {
            const text = ctx.message.text.trim();
            if (courseOption.includes(text)) {
                ctx.session.subInfo.course = text;
                await ctx.reply('Ех, молодість...');
                await ctx.reply(`Звідки дізнався/лась про змагання?`, whereInlineButton);
                return ctx.wizard.next();
            } else {
                await ctx.reply('Будь ласка, виберіть коректний курс.');
            }
        } else {
            await ctx.reply('Виберіть курс із запропонованих варіантів.');
        }
    },

    // Step 6: Handle where
    async (ctx) => {
        if (isTextMessage(ctx.message)) {
            const text = ctx.message.text.trim();
            if (whereOption.includes(text)) {
                ctx.session.subInfo.where = text;
                await ctx.reply('Дякую, що поділився/лась!');
                await ctx.reply('Чи працюєш зараз в інженерії?', workingInlineButton);
                return ctx.wizard.next();
            } else {
                await ctx.reply('Будь ласка, виберіть коректний варіант.');
            }
        } else {
            await ctx.reply('Введіть звідки дізналися про змагання.');
        }
    },

    // Step 7: Handle working
    async (ctx) => {
        if (isTextMessage(ctx.message)) {
            const text = ctx.message.text.trim();
            if (workingOption.includes(text)) {
                ctx.session.subInfo.isWorking = text === workingOption[0] ? true : false;
                await ctx.reply('Ясненько, буду знати!');
                await ctx.reply(`Тепер давай обміняємося контактами`, contactInlineButton);
                return ctx.wizard.next();
            } else {
                await ctx.reply('Будь ласка, виберіть коректну опцію.');
            }
        } else {
            await ctx.reply('Введіть чи працюєте зараз в інженерії.');
        }
    },

    // Step 8: Handle contact
    async (ctx) => {
        if (isContactMessage(ctx.message)) {
            const contact = ctx.message.contact;

            console.log(ctx.from?.username)       
            ctx.session.subInfo.phone = contact.phone_number || '';
            await ctx.reply(`Дякуємо за ваш контакт! Ось контакти нашого головного організатора: @Shiza1705`, Markup.removeKeyboard());
            await ctx.reply("А електронну адресу дасиш?");
            return ctx.wizard.next();
        } else {
            await ctx.reply('Контакт не отримано.');
        }
    },

    // Step 9: Handle email
    async (ctx) => {
        if (isTextMessage(ctx.message)) {
            const email = ctx.message.text.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailRegex.test(email)) {
                await ctx.reply('Будь ласка, введіть коректну пошту.');
            } else {
                ctx.session.subInfo.email = email;
                await ctx.reply('Дякую за таке знайомство!');
                await ctx.reply(`Залишилося тільки надати згоду на обробку даних.`, requestDataInlineButton);
                return ctx.wizard.next();
            }
        } else {
            await ctx.reply('Будь ласка, введіть вашу електронну адресу.');
        }
    },

    async (ctx) => {
        if (isTextMessage(ctx.message) && requestOption.includes(ctx.message.text)) { // Assuming the user clicks an inline button for consent
            ctx.session.isRegistered = true;
            const newUser = new UserModel({...ctx.session });
            await newUser.save();
            await ctx.reply("Супер, реєстрація закінчилась!", Markup.removeKeyboard());
            await ctx.scene.enter('after-registration-menu-wizard');
        } else {
            await ctx.reply('Будь ласка, виберіть опцію для завершення реєстрації.');
        }
    }
);

export default registrationWizard;
