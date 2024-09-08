import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { currentStageModel } from "../database/Schema.class";
import { UpdateStage } from "./update-stage";

export async function SetCurrentStage(stageName: string) {
    await currentStageModel.findOneAndUpdate(
        {},
        { name: stageName }
    );
    UpdateStage();
}