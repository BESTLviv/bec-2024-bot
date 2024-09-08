import { Telegraf, session } from "telegraf";
import { IConfigService } from "./config/config.interface";
import { ConfigService } from "./config/config.service";
import { IBotContext } from "./context/context.interface";
import { StartCommand } from "./commands/start.command";
import { Scenes } from "telegraf";
import ConnectDB from "./database/database";
import registrationWizard from "./stages/registration.scene";
import afterRegistrationMenuWizard from "./stages/after-registration";
import createTeamMenuWizard from "./utils/create-team";
import joinTeamWizard from "./utils/join-team";
import moreInfoMenuWizard from "./utils/more-info.scane";
import myTeamMenuWizard from "./utils/my-team.scene";
import myTeamJoinedMenuWizard from "./utils/my-team-joined.scene";
import adminPanelWizard from "./stages/admin-panel";
import afterApproveMenuWizard from "./stages/after-approve";
import competitionMenuWizard from "./stages/competition";
import afterEventWizard from "./stages/post-event";
import express from 'express';
import { UserModel } from "./database/Schema.class";

export class Bot {
    stage: Scenes.Stage<IBotContext>;
    telegram: any;
    static bot: Telegraf<IBotContext>;

    constructor(private readonly configService: IConfigService) {
        Bot.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"))
        

        ConnectDB();
        Bot.bot.use(session());
        this.stage = new Scenes.Stage<IBotContext>([registrationWizard, afterRegistrationMenuWizard, createTeamMenuWizard, joinTeamWizard, moreInfoMenuWizard, myTeamMenuWizard, myTeamJoinedMenuWizard, adminPanelWizard, afterApproveMenuWizard, competitionMenuWizard, afterEventWizard]);
        Bot.bot.use(this.stage.middleware());
    }

    init() {
        const startCommand = new StartCommand(Bot.bot);
        startCommand.handle();
        Bot.bot.launch();
    }
    static async resetStart() {
        // Ви можете додати код, який буде використовувати статичні ресурси класу
        const users = await UserModel.find({}); // Приклад використання бази даних

        for (const user of users) {
            if (user.chatId) {
                const startCommand = new StartCommand(Bot.bot);
                startCommand.handle();
            }
        }
    }
}

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const bot = new Bot(new ConfigService());
bot.init()

export { bot };