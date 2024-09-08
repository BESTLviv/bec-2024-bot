import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { currentStageModel } from "../database/Schema.class";
import { UpdateStage } from "./update-stage";

export async function SetCurrentStage( ctx: IBotContext,stageName: string) {
    await currentStageModel.findOneAndUpdate(
        {},
        { name: stageName }
    );
    UpdateStage(ctx);
}