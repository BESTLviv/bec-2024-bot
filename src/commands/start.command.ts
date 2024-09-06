import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { Telegraf, Scenes } from "telegraf";
import { UserModel } from "../database/Schema.class";
export class StartCommand extends Command {
    private stage: Scenes.Stage<IBotContext>;

    constructor(bot: Telegraf<IBotContext>, stage: Scenes.Stage<IBotContext>) {
        super(bot);
        this.stage = stage;
    }

    handle(): void {
        this.bot.start(async (ctx) => {
            const user = await UserModel.findOne({ chatId: ctx.chat.id });
            if(!user?.isRegistered || !user) {
                ctx.session.chatId = ctx.chat.id;
                if(ctx.from.username) {
                    ctx.session.userName = ctx.from.username;
                }
                await ctx.scene.enter('registration-wizard');
            } else {
                // ctx.session.stage = "after-registration-menu-wizard"
                // await ctx.scene.enter('after-registration-menu-wizard');
                ctx.session.stage = "competition-menu-wizard"
                await ctx.scene.enter('competition-menu-wizard');
                // ctx.session.stage = "after-approve-menu-wizard"
                // await ctx.scene.enter('after-approve-menu-wizard');

            }        
        });     
    }

    
}
