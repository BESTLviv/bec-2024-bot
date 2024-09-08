import { IBotContext } from "../context/context.interface";
import { UserModel } from "../database/Schema.class";
import { isTextMessage } from "./generaly-utils.functions";
import { GetCurrentStage } from "./get-current-stage";
import { sendMessage, wrapStringAsMessage } from "./send-message";

export async function UpdateStage(ctx: IBotContext, currentScene: string) {

   
    
    const currentStage = await GetCurrentStage();
    console.log(currentStage, currentScene)
    if(currentStage != null && currentStage !== currentScene) {
        ctx.session.stage = currentStage
        await ctx.scene.enter(currentStage);
        
        
    }


    
    // // Проверяем, что ctx.chat существует
    // if(ctx.chat && 'id' in ctx.chat && isTextMessage(ctx.chat)) {
    //     const user = await UserModel.findOne({ chatId: ctx.chat.id });
        
    //     // Проверяем, что пользователь зарегистрирован
    //     if(!user?.isRegistered || !user) {
    //         ctx.session.chatId = ctx.chat.id;

    //         // Проверяем, что ctx.from и ctx.from.username существуют
    //         if(ctx.from && ctx.from.username) {
    //             ctx.session.userName = ctx.from.username;
    //         }
    //         await ctx.scene.enter('registration-wizard');
    //     } else {
    //         const currentStage = await GetCurrentStage();
    //         if(currentStage == null) {
    //             console.log("Не визначенно теперешньої секції");
    //             return;
    //         }
    //         ctx.session.stage = currentStage;
    //         await ctx.scene.enter(currentStage);
    //     }     
    // }
}