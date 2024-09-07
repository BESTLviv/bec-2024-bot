import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { Telegraf, Scenes } from "telegraf";
import { UserModel, currentStageModel } from "../database/Schema.class";
import { GetCurrentStage } from "../utils/get-current-stage";
export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start(async (ctx) => {
            const teamDB = new currentStageModel({
                name: "after-registration-menu-wizard",

            });
            await teamDB.save();


            const user = await UserModel.findOne({ chatId: ctx.chat.id });
            if(!user?.isRegistered || !user) {
                ctx.session.chatId = ctx.chat.id;
                if(ctx.from.username) {
                    ctx.session.userName = ctx.from.username;
                }
                await ctx.scene.enter('registration-wizard');
            } else {
                const currentStage = await GetCurrentStage();
                if(currentStage == null) {
                    console.log("Не визначенно теперешньої секції")
                    return;
                }
                ctx.session.stage = currentStage
                await ctx.scene.enter(currentStage);

                // ctx.session.stage = "competition-menu-wizard"
                // await ctx.scene.enter('competition-menu-wizard');
                // ctx.session.stage = "after-approve-menu-wizard"
                // await ctx.scene.enter('after-approve-menu-wizard');

            }        
        });     
    }

    
}
