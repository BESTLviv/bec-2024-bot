import { IBotContext } from "../context/context.interface";
import { Scenes } from "telegraf";
import { UserModel, teamModel } from "../database/Schema.class";
import { backOption, backboard } from "../markups/after-registration.class";
import { isTextMessage } from "./generaly-utils.functions";

// let team: any;

const joinTeamWizard = new Scenes.WizardScene<IBotContext>(
    'join-team-wizard',
    async (ctx) => {
        await ctx.reply("Введіть назву команди, до якої ви хочете приєднатися", backboard); 
        ctx.wizard.next();
    },
    async (ctx) => {
        if(isTextMessage(ctx.message)) {
            const name = ctx.message.text.trim();

            if (!name) {
                await ctx.reply('Будь ласка, введіть коректну назву команди.');
                return  ctx.wizard.selectStep(1);
            } 

            ctx.session.team = await teamModel.findOne({ name: name });
            if(!ctx.session.team) {
                await ctx.reply('Такої команди не знайдено');
                return  ctx.wizard.selectStep(1); 
            }

            await ctx.reply("Тепер введи пароль до цієї команди"); 
            return ctx.wizard.next();  
        }
    },
    async (ctx) => {
        if(isTextMessage(ctx.message)) {
            const password = ctx.message.text.trim();
            if(ctx.session.team) {
                if(ctx.session.team.password !== password) {
                    await ctx.reply("Невірний пароль"); 
                    return  ctx.wizard.selectStep(2);
                }
                if(ctx.session.team.members.length > 4) {
                    await ctx.reply("В цій команді вже є максимальна кількість учасників."); 
                    return  ctx.wizard.selectStep(2);  
                }
    
                let user;
                if(ctx.chat) {
                    user = await UserModel.findOne({ chatId: ctx.chat.id });
                }
                if(!user) {
                    await ctx.reply('Невдалося приєднатися до команди');
                    return ctx.scene.enter("my-team-menu-wizard");  
                }
                user.team = ctx.session.team._id;
                user.save();
                ctx.session.team.members = [user._id, ...ctx.session.team.members]
                ctx.session.team.save();
    
                await ctx.reply('Ви успішно доєдналися до команди');
                return ctx.scene.enter("after-registration-menu-wizard");  
            }
            else {
                await ctx.reply("Введи коректний пароль до команди")
            }
        }
        else {
            await ctx.reply("Введи коректний пароль до команди")
        }
    }
);

joinTeamWizard.hears(backOption[0], (ctx) => {
    ctx.scene.enter("after-registration-menu-wizard");
})


export default joinTeamWizard;

