import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import { infoKeyboard, infoOption, menuKeyboard } from "../markups/after-registration.class";
import moreInfo from '../data/moreInfo.json';
import { menuKeyboardAfterApprove } from "../markups/after-approve.markups";
import { getSceneAndKeyboard } from "./generaly-utils.functions";

let currentSceneKeyboard: any;
let currentStage: string;

const moreInfoMenuWizard = new Scenes.WizardScene<IBotContext>(
    'more-info-menu-wizard',
    async (ctx) => {
        const { keyboard, scene } = await getSceneAndKeyboard(ctx);
        currentStage = scene;
        currentSceneKeyboard = keyboard;
        await ctx.reply(currentStage);  
        await ctx.reply(moreInfo.main, infoKeyboard);  
    }
);

moreInfoMenuWizard.hears(infoOption[0], async (ctx) => {
    return ctx.scene.enter(currentStage, currentSceneKeyboard);  
})
moreInfoMenuWizard.hears(infoOption[1], async (ctx) => {
    await ctx.reply(moreInfo.categories);  
})
moreInfoMenuWizard.hears(infoOption[2], async (ctx) => {
    await ctx.reply(moreInfo.dateWhere);  
})
moreInfoMenuWizard.hears(infoOption[3], async (ctx) => {
    await ctx.reply(moreInfo.rules);  
})
moreInfoMenuWizard.hears(infoOption[4], async (ctx) => {
    const keyboard = Markup.inlineKeyboard([
        [
            Markup.button.url('Більше про BEC', 'https://bec-2024.best-lviv.org.ua/ua'),
            Markup.button.url('Більше про BEST', 'https://bec-2024.best-lviv.org.ua/ua')
        ],
    ]);

    await ctx.reply(moreInfo.organizers, keyboard);
})

export default moreInfoMenuWizard;

