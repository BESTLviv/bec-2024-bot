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
import express from 'express';
import createResumeWizard from "./utils/create-resume.scene";

export class Bot {

    stage: Scenes.Stage<IBotContext>;
    telegram: any;
    bot: Telegraf<IBotContext>;

    constructor(private readonly configService: IConfigService) {
       this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"))
        
        ConnectDB();
        this.bot.use(session());
        this.stage = new Scenes.Stage<IBotContext>([registrationWizard, afterRegistrationMenuWizard, createTeamMenuWizard, joinTeamWizard, moreInfoMenuWizard, myTeamMenuWizard, myTeamJoinedMenuWizard, adminPanelWizard, afterApproveMenuWizard, createResumeWizard]);
        this.bot.use(this.stage.middleware());
    }

    init() {
        const startCommand = new StartCommand(this.bot);
        startCommand.handle();
        this.bot.launch();
    }

    
}

const app = express();
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const bot = new Bot(new ConfigService());
bot.init()
