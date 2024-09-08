import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { UserModel, currentStageModel } from "../database/Schema.class";
import { UpdateStage } from "./update-stage";
import { sendMessage, wrapStringAsMessage } from "./send-message";

export async function SetCurrentStage( ctx: IBotContext,stageName: string) {
    await currentStageModel.findOneAndUpdate(
        {},
        { name: stageName }
    );
    const users = await UserModel.find({})
    if(users && users.length > 0) {
        sendMessage(ctx, users, wrapStringAsMessage("Ура, нарешті почався новий етап, для того щоб оновити меню, введіть /reload"));
    }
}