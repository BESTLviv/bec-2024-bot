import { IBotContext } from "../context/context.interface";
import { UserModel, teamModel } from "../database/Schema.class";
import { menuKeyboardAfterApprove } from "../markups/after-approve.markups";
import { menuKeyboard } from "../markups/after-registration.class";
import { GetCurrentStage } from "./get-current-stage";

export async function GetUsersFromTeam(team: any) {
    const users: any[] = [];
    if (team) {
      for(const memberId of team.members) {
          const user = await UserModel.findById(memberId);
          if(user) {
            users.push(user);
          }
      }
    }
    return users;
}

export async function DeleteTeam(team: any) {
  const users = await GetUsersFromTeam(team);
  try{
    await teamModel.findByIdAndDelete(team._id);
    for(const user of users) {
        user.team = null;
    }
  } 
  catch(error) {
    throw new Error("Виникла помилка при видаленні команди");
  }
  return users;
}

export function isTextMessage(message: any): message is { text: string } {
    return message && message.text !== undefined;
}
export function isPhotoMessage(message: any): message is { photo: any[] } {
    return message && message.photo !== undefined;
}
export function isDocumentMessage(message: any): message is { document: any } {
    return message && message.document !== undefined;
}

interface ContactMessage {
    contact: {
        user_id?: number;
        phone_number?: string;
    };
}
export function isContactMessage(message: any): message is ContactMessage {
    return message && message.contact !== undefined;
}

export async function getSceneAndKeyboard(ctx: IBotContext) {
  const stage = await GetCurrentStage()
  switch (stage) {
    case 'after-approve-menu-wizard':
        return {
            scene: 'after-approve-menu-wizard',
            keyboard: menuKeyboardAfterApprove
        };
    case 'after-registration-menu-wizard':
        return {
            scene: 'after-registration-menu-wizard',
            keyboard: menuKeyboard
        };
    default: {
        throw new Error(`Немає такої сцени ${stage}`)
    } 
  }
}
