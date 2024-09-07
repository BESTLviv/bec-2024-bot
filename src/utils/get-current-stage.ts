import { currentStageModel } from "../database/Schema.class";

export async function GetCurrentStage(): Promise<string | null> {
    const currentStage = await currentStageModel.findOne();
    if(!currentStage || !currentStage.name) {
        return null;
    }
    else {
        return currentStage.name;
    }
   
}