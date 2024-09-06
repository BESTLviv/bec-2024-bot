import { Markup } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { ITeam, UserModel, teamModel } from "../database/Schema.class";
import { adminTeamBoard, adminTeamOptions } from "../markups/admin-panel.markups";
import { sendMessage, wrapStringAsMessage } from "./send-message";
import { getTeamInfo } from "./get-team-info";
import { GetUsersFromTeam, DeleteTeam } from "./generaly-utils.functions";

const PAGE_SIZE = 10;

export async function sendTeamsList(ctx: IBotContext, page = 0) {
  const teams = await teamModel.find();
  const totalPages = Math.ceil(teams.length / PAGE_SIZE);
  
  const start = page * PAGE_SIZE;
  const end = start + PAGE_SIZE;
  const teamsToShow = teams.slice(start, end);

  const buttons: Array<ReturnType<typeof Markup.button.callback>> = teamsToShow.map((team) => {
    if (team.name) {
      return Markup.button.callback(team.name, `team_${team._id}`);
    }
  }).filter(Boolean) as Array<ReturnType<typeof Markup.button.callback>>;

  // Кнопки пагінації
  if (page > 0) {
    buttons.push(Markup.button.callback('⬅️ Назад', `page_${page - 1}`));
  }
  if (page < totalPages - 1) {
    buttons.push(Markup.button.callback('➡️ Вперед', `page_${page + 1}`));
  }

  const keyboard = Markup.inlineKeyboard(buttons, { columns: 2 });

  if (ctx.updateType === 'callback_query') {
    await ctx.editMessageText('Список команд:', keyboard);
  } else {
    await ctx.reply('Список команд:', keyboard);
  }
}

export async function showTeamInList(ctx: IBotContext, team: any) {
    const teamInfo = await getTeamInfo(team);

    if (ctx.updateType === 'callback_query') {
      await ctx.editMessageText(teamInfo, adminTeamBoard);
    } else {
      await ctx.reply(teamInfo, adminTeamBoard);
    }
}

export async function handleOption(ctx: IBotContext, option: string, team: any) {
  switch (option) {
      case adminTeamOptions.MSG:
          ctx.reply("Введіть повідомлення");
          ctx.wizard.selectStep(2) // IN scene admin-panel-wizard
          break;
      case adminTeamOptions.APPROVE: {
          team.isApprove = true;
          team.save()
          const users = await GetUsersFromTeam(team);
          await sendMessage(ctx, users, wrapStringAsMessage("Вас апрувнули"))
          await sendTeamsList(ctx);
          break;
      }  
      case adminTeamOptions.REJECT: {
          team.isApprove = false;
          team.save()
          const users = await GetUsersFromTeam(team);
          await sendMessage(ctx, users, wrapStringAsMessage("Вас реджектнули"))
          await sendTeamsList(ctx);
          break;
      }  
      case adminTeamOptions.DELETE:
          try{
            DeleteTeam(team);
          }
          catch(error){
            await ctx.reply(error instanceof Error ? error.message : String(error));
          }
          await ctx.reply("Ви успішно видалили команду");
          sendTeamsList(ctx);
          break;
      case adminTeamOptions.BACK:
          sendTeamsList(ctx);
          break;
      default:
          await ctx.reply("Невідома опція.");
          sendTeamsList(ctx);
  }
}

export { GetUsersFromTeam };

