
import { IBotContext } from "../context/context.interface";
import { Context, Telegraf } from "telegraf";
import { Contact } from "telegraf/typings/core/types/typegram";
import { IUser } from "../user.interface";
import { Markup } from "telegraf";
import { educationInlineButton, courseInlineButton, contactInlineButton, workingInlineButton, requestDataInlineButton, whereInlineButton } from "../markups/registration.markups";
import { UserModel } from "../database/Schema.class";
import { Section } from "./section.interface";
import { courseOption, whereOption, workingOption, requestOption } from "../markups/registration.markups";

export class RegistrationSection implements Section {

    

    // private user: IUser = {
    //     chatId: 0,  
    //     specialization: '',
    //     name: '',     
    //     where: '',
    //     age: 0,         
    //     education: '',   
    //     course: '',
    //     isWorking: false,
    //     email: '',
    //     contact: {
    //             phone: '',
    //             address: ''
    //     }
    // };

    ctx: IBotContext;
    bot: Telegraf<IBotContext>;
    private step = 0;
    private steps: Array<(ctx: IBotContext, sub: any) => Promise<void>>; 

    constructor(ctx: IBotContext, bot: Telegraf<IBotContext>) {
        this.ctx = ctx;
        this.bot = bot;
        this.ctx.session.subInfo = this.ctx.session.subInfo || {};
        // this.ctx.session.subInfo.contact = this.ctx.session.subInfo.contact || {};

        this.steps = [
            this.handleAge.bind(this),
            this.handleEducation.bind(this),
            this.handleSpecialization.bind(this),
            this.handleCourse.bind(this),
            this.handleWhere.bind(this),
            this.handleWorking.bind(this),
            this.handleContact.bind(this),
            this.handleEmail.bind(this),
            this.handleRequestDataProcessing.bind(this),
        ];
        return;
    }

    handle() {
        if (this.ctx.chat) {
            this.ctx.session.chatId = this.ctx.chat.id;
            this.ctx.reply('Привіт, давай знайомитися!');
            this.ctx.reply('Введіть ваш вік:');
            this.registerListeners(); 
        }
        
    }

    registerListeners() {
        // Text listener
        this.bot.on('text', async (ctx) => {
            if (this.steps[this.step]) {
                await this.steps[this.step](ctx, ctx.message.text);
            }
        });

        // Contact listener
        this.bot.on('contact', async (ctx) => {
            await this.handleContact(ctx, "", ctx.message.contact);
        });
    }

    private NextStep() {
        this.step++;
    }

    private async handleAge(ctx: IBotContext, text: string): Promise<void> {
        const age = parseInt(text);
        if (isNaN(age) || age < 1 || age > 100) {
            await ctx.reply('Будь ласка, введіть коректний вік');
        } else {
            this.ctx.session.subInfo.age = age;
            this.NextStep()
            await ctx.reply("Поважна цифра😎");
            await ctx.reply("Де вчишся? Вибери або просто введи", educationInlineButton);
        }
    }

    private async handleEducation(ctx: IBotContext, text: string): Promise<void> {
        const education = text.trim();
        if (education.length === 0) {
            await ctx.reply('Будь ласка, введіть коректне місце навчання');
        } else {
            this.ctx.session.subInfo.education = education;
            this.NextStep()
            await ctx.reply('На якій спеціальності навчаєшся?',  Markup.removeKeyboard());
        }
    }
    
    private async handleSpecialization(ctx: IBotContext, text: string): Promise<void> {
        let specialization = text.trim();
        if(specialization.length === 0) {
            await ctx.reply('Будь ласка, введіть коректну спеціальність.');
        }
        else {
            this.ctx.session.subInfo.specialization = specialization;
            this.NextStep()
            await ctx.reply('Крутий вибір!');
            await ctx.reply('А на якому курсі зараз?', courseInlineButton);
        }
    }

    private async handleCourse(ctx: IBotContext, text: string): Promise<void> {
            if(courseOption.includes(text)) {
                this.ctx.session.subInfo.course = text;
                this.NextStep();
                await ctx.reply('Ех, молодість...');
                await ctx.reply(`Звідки дізнався/лась про змагання?`, whereInlineButton);
            }
    }
 
    private async handleWhere(ctx: IBotContext, text: string): Promise<void> {
        if(whereOption.includes(text)) {
            this.ctx.session.subInfo.where = text;
            this.NextStep();
            await ctx.reply('Дякую, що поділився/лась!');
            await ctx.reply('Чи працюєш зараз в інженерії?', workingInlineButton);
        }
    }

    private async handleWorking(ctx: IBotContext, text: string): Promise<void> {
        if(workingOption.includes(text)) {
            this.ctx.session.subInfo.isWorking = text === workingOption[0] ? true : false
            this.NextStep();
            await ctx.reply('Ясненько, буду знати!');
            await ctx.reply(`Тепер давай обміняємося контактами`, contactInlineButton);
        }
    }

    private async handleContact(ctx: IBotContext, text: string, contact?: Contact): Promise<void> {
        if (contact) {
            if(contact.user_id) {
                // this.ctx.session.subInfo.contact.userId = contact.user_id;
            }   
            console.log(contact.first_name)    
            console.log(contact.last_name)    
            // this.ctx.session.subInfo.contact.phone = contact.phone_number;
            this.NextStep();
            await ctx.reply(`Дякуємо за ваш контакт! Ось контакти нашого головного організатора: @Shiza1705`, Markup.removeKeyboard());     
            await ctx.reply("А електронну адресу дасиш?");  
        } else {
            await ctx.reply('Контакт не отримано.');
        }
    }

    private async handleEmail(ctx: IBotContext, text: string): Promise<void> {
        let email = text.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        if(!emailRegex.test(email)) {
            await ctx.reply('Будь ласка, введіть коректну пошту.');
        }
        else {
            this.ctx.session.subInfo.email = email;
            this.NextStep()
            await ctx.reply('Дякую за таке знайомство!');
            await ctx.reply(`Залишилося тільки надати згоду на обробку даних.`, requestDataInlineButton);
        }

    }

    private async handleRequestDataProcessing(ctx: IBotContext, text: string): Promise<void> {
        if(requestOption.includes(text)) { //name of access button
            await ctx.reply("Супер, реєстрація закінчилась!", Markup.removeKeyboard());
            console.log(this.ctx.session)
            this.ctx.session.isRegistered = true;
            const newUser = new UserModel({...this.ctx.session });

    
            // Збереження користувача в базу даних
            await newUser.save();
        }  
    }
    
}