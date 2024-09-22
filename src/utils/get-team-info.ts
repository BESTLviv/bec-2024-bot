import { IBotContext } from "../context/context.interface";
import { UserModel, teamModel } from "../database/Schema.class";

export async function getTeamInfo(team: any): Promise<string> {
    const membersInfo = await getMembersInfo(team);
    let teamInfo = "Інформація про команду\n\n";

    teamInfo += `Назва команди: ${team?.name}\n`;
    teamInfo += `Вибрана категорія: ${team?.category}\n`;
    teamInfo += `Список технологій команди: ${team?.technologyList ? team?.technologyList : "❌"}\n`;


    if(team?.category === "Team Design") {
        teamInfo += `Посилання на тестове завдання: ${team?.testTask ? team?.testTask : "❌"}\n`;
    }
    else if (team?.category === "Case Study") {
        teamInfo += `PDF-файл з тестовим завданням: ${team?.testTask ? team?.testTask : "❌"}\n`;
    }

    // teamInfo += `Відіслане тестове завдання: ${team?.testTask ? team?.testTask : "❌"}\n`;
    teamInfo += `Команда допущена до змагань: ${team?.isApprove ? "✅" : "❌"}\n\n`;
    teamInfo += `Учасники команди:\n${membersInfo}`;

    return teamInfo;
}

async function getMembersInfo(team: any): Promise<string> {
    let membersInfo = "";
    for (const member of team.members) {
        const user = await UserModel.findById( member );
        if (user?.userName) {
            membersInfo += "@" + user.userName;
            membersInfo += ": Наявність CV - " + (user.cv ? "✅" : "❌") + "\n";
        }
    }
    return membersInfo;
}

