import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import { infoKeyboard, infoOption, menuKeyboard } from "../markups/after-registration.class";
import moreInfo from '../data/moreInfo.json';
import { menuKeyboardAfterApprove } from "../markups/after-approve.markups";
import { getSceneAndKeyboard } from "./generaly-utils.functions";
import path from "path";
import { TimeCheck } from "./timeCheck";

// let currentSceneKeyboard: any;
// let currentStage: string;

const moreInfoMenuWizard = new Scenes.WizardScene<IBotContext>(
    'more-info-menu-wizard',
    async (ctx) => {
        try{
            const { keyboard, scene } = await getSceneAndKeyboard(ctx);
            ctx.session.currentStage = scene;
            ctx.session.currentSceneKeyboard = keyboard;
            
            await ctx.replyWithPhoto(
                { source: path.join(__dirname, '../../public/about.jpg')},
                {
                    caption: moreInfo.main,
                    reply_markup: infoKeyboard.reply_markup,
                }
            );
        }   
        catch (error) {
            return;
        }
        
    }
);

moreInfoMenuWizard.hears(infoOption[0], async (ctx) => {
    return ctx.scene.enter(ctx.session.currentStage, ctx.session.currentSceneKeyboard);  
})

moreInfoMenuWizard.hears(infoOption[1], async (ctx) => {
    try{
        await TimeCheck(ctx)
        await ctx.reply(moreInfo.categories);    
    } catch(error) {
        return;
    }
})
moreInfoMenuWizard.hears(infoOption[2], async (ctx) => {
    try{
        await TimeCheck(ctx)
        await ctx.reply(moreInfo.dateWhere);  
    } catch(error) {
        return;
    }
})
moreInfoMenuWizard.hears(infoOption[3], async (ctx) => {
    try{
        await TimeCheck(ctx)
        await ctx.reply(moreInfo.rules);   
        const filePath = path.join(__dirname, '../../public/Правила.pdf');
        await ctx.replyWithDocument({ source: filePath })
    } catch(error) {
        return;
    }
})
moreInfoMenuWizard.hears(infoOption[4], async (ctx) => {
    try{
        await TimeCheck(ctx)
        const keyboard = Markup.inlineKeyboard([
            [
                Markup.button.url('Більше про BEC', 'https://bec-2024.best-lviv.org.ua/ua'),
                Markup.button.url('Більше про BEST', 'https://bec-2024.best-lviv.org.ua/ua')
            ],
        ]);
    
        await ctx.reply(moreInfo.organizers, keyboard);
    } catch(error) {
        return
    }
   
})

export default moreInfoMenuWizard;

