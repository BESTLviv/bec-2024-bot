import { Context, Scenes } from "telegraf";
import { Any } from "telegraf/typings/core/helpers/util";

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
        isWorking: string;
        email: string;
        phone: string;
    };
    stage: string;

    team: any,
    teamName: string,
    teamPassword: string,
    teamCategoty: string,
    teamTechnologyList: string,

    userLastMessageTime: { [userId: number]: number }

    currentSceneKeyboard: any;
    currentStage: string;
    resume: {
        personalInfo: {
            photoUrl: string;
            fullName: string;
            location: string;
            phone: string;
            email: string;
            birthDate: string;
            maritalStatus: string;
            linkedIn: string;
          };
          qualification: string;
          workExperience: Array<{
            position: string;
            company: string;
            location: string;
            dateRange: string;
            responsibilities: string[];
          }>;
          education: Array<{
            degree: string;
            institution: string;
            dateRange: string;
          }>;
          skills: string[];
    }
}

// Extend IBotContext to include scene and wizard
export interface IBotContext extends Context {
    match: any;
    // [x: string]: any;
    session: SessionData & Scenes.SceneSession<Scenes.WizardSessionData>;
    scene: Scenes.SceneContextScene<IBotContext, Scenes.WizardSessionData>;
    wizard: Scenes.WizardContextWizard<IBotContext>;
}
