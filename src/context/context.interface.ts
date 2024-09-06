import { Context, Scenes } from "telegraf";

export interface SessionData extends Scenes.WizardSessionData {
    chatId: number;
    userName: string;
    cv: String,
    isRegistered: boolean;
    subInfo: {
        age: number;
        education: string;
        course: string;
        specialization: string;
        where: string;
        isWorking: boolean;
        email: string;
        phone: string;
    };
    stage: string;
}

// Extend IBotContext to include scene and wizard
export interface IBotContext extends Context {
    match: any;
    // [x: string]: any;
    session: SessionData & Scenes.SceneSession<Scenes.WizardSessionData>;
    scene: Scenes.SceneContextScene<IBotContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<IBotContext>;
}
