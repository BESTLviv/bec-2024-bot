import { currentStageModel } from "../database/Schema.class";

export async function SetCurrentStage(stageName: string) {
    await currentStageModel.findOneAndUpdate(
        {},
        { name: stageName }
    );
}