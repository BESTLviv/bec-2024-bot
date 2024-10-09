import { IBotContext } from "../context/context.interface";
import { Markup, Scenes } from "telegraf";
import { adminKeyboard, adminOption, sendKeyboard, sendOption } from "../markups/admin-panel.markups";
import { UserModel, teamModel } from "../database/Schema.class";
import { GetUsersFromTeam, handleOption, sendTeamsList, showTeamInList } from "../utils/team-list-menu";
import { handleFilesAndSendArchive } from "../utils/download-cv";
import { sendMessage } from "../utils/send-message";
import { GetCurrentStage } from "../utils/get-current-stage";
import { SetCurrentStage } from "../utils/set-current-stage";
import { UpdateStage } from "../utils/update-stage";
import { getSceneAndKeyboard } from "../utils/generaly-utils.functions";


function isTextMessage(message: any): message is { text: string } {
    return message && message.text !== undefined;
}

let selectedUsers: any[];
let selectedTeam: any;
let option: string;
let currentStage: any;
let currentSceneKeyboard: any;

const adminPanelWizard = new Scenes.WizardScene<IBotContext>(
    'admin-panel-wizard',
    async (ctx) => {
        try{
            const { keyboard, scene } = await getSceneAndKeyboard(ctx);
            currentStage = scene;
            currentSceneKeyboard = keyboard;
            await ctx.reply("Вітаємо в адмін панелі!", adminKeyboard);
        }
        catch (error) {
            return;
        }
    }, 
    //----------------------------------sendOption[0]-------------------------------------
    async (ctx) => {
        try{
            if (ctx.chat && isTextMessage(ctx.message) && sendOption.includes(ctx.message.text.trim())) {
                const option = ctx.message.text.trim();
    
                switch (option) {
                    case sendOption[0]:
                        selectedUsers = await UserModel.find({});
                        break;
                    case sendOption[1]:
                        selectedUsers = await UserModel.find({ isRegistered: true });
                        break;
                    case sendOption[2]:
                        selectedUsers = await UserModel.find({ isRegistered: false });
                        break;
                    case sendOption[3]:
                        selectedUsers = await UserModel.find({ team: { $exists: true, $ne: null } });
                        break;
                    case sendOption[4]:
                        selectedUsers = await UserModel.find({ isParticipant: true}); 
                        break;
                    case sendOption[5]:
                        selectedUsers = [await UserModel.findOne({ chatId: ctx.chat.id })];
                        break;
                    default:
                        await ctx.reply("Невідома опція.");
                        await ctx.scene.enter("admin-panel-wizard"); 
                }
                await ctx.reply('Введіть повідомлення(текст, картинка-текст, документ, документ-текст), яке ви хочете надіслати:', Markup.removeKeyboard());
                return ctx.wizard.next()
            }
            else {
                await ctx.scene.enter("admin-panel-wizard");  
            }
        }
        catch (error) {
            return;
        }  
    }, 
    async (ctx) => {
        try{
            if (ctx.chat) {
                if(ctx.message) {
                    await sendMessage(ctx, selectedUsers, ctx.message);
                }
                else {
                    await ctx.reply("Повідомлення не було знайдено. Будь ласка, спробуйте ще раз.");
                }
            }    
            await ctx.scene.enter("admin-panel-wizard"); 
        }
        catch (error) {
            return;
        }
    },
);

adminPanelWizard.hears(adminOption[0], async (ctx) => { 
    await ctx.reply('Вибери кому надішлеш повідомлення', sendKeyboard);
    ctx.wizard.selectStep(1)
})
adminPanelWizard.hears(adminOption[1], async (ctx) => {
    await sendTeamsList(ctx);
})
adminPanelWizard.hears(adminOption[2], async (ctx) => {
    const users = await UserModel.find({ isRegistered: true });
    const fileLinks: string[] = [];
    if(!users) {
        await ctx.reply(`Не вдалося завантажити CVs`);
    }
    else {
        for(const user of users) {
            if(user.cv) {
                const fileLink = await ctx.telegram.getFileLink(user.cv);
                fileLinks.push(fileLink.href);  
            }
        }
        handleFilesAndSendArchive(ctx, fileLinks);
    }
    
})

const stages = [
    "after-registration-menu-wizard",
    'after-approve-menu-wizard',
    'competition-menu-wizard',
    'post-event-menu-wizard',

]
adminPanelWizard.hears(adminOption[3], async (ctx) => {
    const currentStage = await GetCurrentStage();
    if(currentStage !== null) {
        stages.findIndex((element, index) => {
            if(element === currentStage && index != 0) {
                SetCurrentStage(ctx, stages[index - 1]);
                ctx.reply(`Ви перейшли на попередню стадію`);
            }
         })
    }
})
adminPanelWizard.hears(adminOption[4], async (ctx) => {
    const currentStage = await GetCurrentStage();
    if(currentStage !== null) {
        stages.findIndex((element, index) => {
            if(element === currentStage && index !== 1) {
                SetCurrentStage(ctx, stages[index + 1]);
                ctx.reply(`Ви перейшли на наступну стадію`);
            }
         })
    }
    
})

adminPanelWizard.hears(adminOption[5], async (ctx) => {
    return ctx.scene.enter(currentStage, currentSceneKeyboard);  
})

adminPanelWizard.action(/page_(\d+)/, async (ctx) => {
    const page = parseInt(ctx.match[1]);
    await sendTeamsList(ctx, page);
});

adminPanelWizard.action(/team_(.+)/, async (ctx) => {
    const teamId = ctx.match[1];
    selectedTeam = await teamModel.findById( teamId );
    selectedUsers = await GetUsersFromTeam(selectedTeam);
    await showTeamInList(ctx, selectedTeam);
});

adminPanelWizard.action(/adminTeam_(.+)/, async (ctx) => {
    option = ctx.match[0];
    handleOption(ctx, option, selectedTeam);
});


export default adminPanelWizard;


