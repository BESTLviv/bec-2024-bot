import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import { UserModel, teamModel } from "../database/Schema.class";
import { categoriesboard, categoriesOption, backOption, backboard } from "../markups/after-registration.class";
import { isTextMessage } from "./generaly-utils.functions";

const team = {
    name: "",
    password: "",
    categoty: ""
}

const createTeamMenuWizard = new Scenes.WizardScene<IBotContext>(
    'create-team-wizard',
    async (ctx) => {
        await ctx.reply("Придумай назву команди", backboard); 
        ctx.wizard.next()
    },
    async (ctx) => {
        if(isTextMessage(ctx.message)) {
            const name = ctx.message.text.trim();
            console.log(name)
            if (name.length > 30) {
                await ctx.reply('Назва команди має містити в собі до 30 символів. Будь ласка, введіть коректну назву.');
                return ctx.wizard.selectStep(1);
            }

            if (!name) {
                await ctx.reply('Будь ласка, введіть коректну спеціальність.');
                return ctx.wizard.selectStep(1);
            } 

            const existingTeam = await teamModel.findOne({ name });
            if (existingTeam) {
                await ctx.reply('Команда з такою назвою вже існує. Будь ласка, введіть іншу назву.');
                return ctx.wizard.selectStep(1);
            }

            team.name = name;
            await ctx.reply('Звучить потужно!');
            await ctx.reply("Тепер вибери категорію, за якою буде приймати участь ваша команда", categoriesboard); 
            return ctx.wizard.next();  
        }
    },
    async (ctx) => {
        if(isTextMessage(ctx.message)) {
            const categoty = ctx.message.text.trim();
            
            if (categoty != categoriesOption[0] && categoty != categoriesOption[1]) {
                await ctx.reply('Будь ласка, виберіть одну з вибраних категорій');
                return  ctx.wizard.selectStep(2);
            }

            team.categoty = categoty;
            await ctx.reply("Тепер придумай пароль для команди",  Markup.removeKeyboard()); 
            return ctx.wizard.next();  
        }
    },
    async (ctx) => {
        if(isTextMessage(ctx.message)) {
            const password = ctx.message.text.trim();

            if (password.length < 8 || password.length > 30 || !password) {
                await ctx.reply('Пароль повинен містити від 8 до 30 символів. Будь ласка, введіть коректний пароль.');
                return  ctx.wizard.selectStep(3);
            }
            team.password = password;
            let user;
            if(ctx.chat) {
                user = await UserModel.findOne({ chatId: ctx.chat.id });
            }
            else {
                await ctx.reply('Невдалося створити команду');
                return ctx.scene.enter("after-registration-menu-wizard");  
            }            
            if (user) {
                const teamDB = new teamModel({
                    name: team.name,
                    password: team.password,
                    category: team.categoty,
                    members: user?._id,
                });
                user.team = teamDB._id;
                await teamDB.save();
                await user.save();
            }
            else {
                await ctx.reply('Невдалося створити команду');
                return ctx.scene.enter("after-registration-menu-wizard");  
            }   
           

            await ctx.reply('Створення команди завершено!');
            return ctx.scene.enter("after-registration-menu-wizard");  
        }
        else {
            await ctx.reply("Придумай пароль для команди")
        }
    }

);

createTeamMenuWizard.hears(backOption[0], (ctx) => {
    ctx.scene.enter("after-registration-menu-wizard");
})

export default createTeamMenuWizard;

