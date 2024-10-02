import { Command } from "./command.class";
import { IBotContext } from "../context/context.interface";
import { Telegraf, Scenes } from "telegraf";
import { UserModel, currentStageModel } from "../database/Schema.class";
import { GetCurrentStage } from "../utils/get-current-stage";
import { UpdateStage } from "../utils/update-stage";
import { TimeCheck } from "../utils/timeCheck";
export class StartCommand extends Command {
    constructor(bot: Telegraf<IBotContext>) {
        super(bot);
    }

    handle(): void {
        this.bot.start(async (ctx) => {
                try{
                    await TimeCheck(ctx)
                    console.log(1235)
                    const currentStage = await GetCurrentStage();
                    const user = await UserModel.findOne({ chatId: ctx.chat.id });
                    console.log(user, user?.isRegistered)
                    if(!user) {
                        const user = new UserModel({
                            chatId: ctx.chat.id,
                        });
                        await user.save();
                    }
                    if(!user?.isRegistered) {
        
                        if(currentStage == 'after-registration-menu-wizard') {
                            ctx.session.chatId = ctx.chat.id;
                            if(ctx.from.username) {
                                ctx.session.userName = ctx.from.username;
                            }
                            await ctx.scene.enter('registration-wizard');
                        }
                        else {
                            ctx.reply("Нажаль час реєстрації минув, дивіться за останніми новинами про BEC разом з нами")
                        }
                        
                    } else {
                        const currentStage = await GetCurrentStage();
                        console.log("11", currentStage)
                        if(currentStage == null) {
                            console.log("Не визначенно теперешньої секції")
                            return;
                        }
                        ctx.session.stage = currentStage
                        await ctx.scene.enter(currentStage);
        
                    }      
                    
                }
                catch(error) {
                    return;
                }
            
           
        });    
    }

    
}
