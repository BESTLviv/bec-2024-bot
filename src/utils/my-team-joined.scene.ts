import { IBotContext } from "../context/context.interface";
import { Scenes } from "telegraf";
import { UserModel, teamModel } from "../database/Schema.class";
import { menuKeyboard, teamProfileAfterApprove, teamProfileOption } from "../markups/after-registration.class";
import { workingInlineButton, workingOption } from "../markups/registration.markups";
import * as path from 'path';
import { getTeamInfo } from "./get-team-info";
import { isTextMessage, isDocumentMessage, getSceneAndKeyboard } from "./generaly-utils.functions";
import { teamCompetitionOption, teamCompetitionboard } from "../markups/competition.markups";

let currentSceneKeyboard: any;
let currentStage: string;

const myTeamJoinedMenuWizard = new Scenes.WizardScene<IBotContext>(
    'my-team-joined-menu-wizard',
    async (ctx) => {

        const { scene, keyboard } = await getSceneAndKeyboard(ctx);
        currentStage = scene;
        currentSceneKeyboard = keyboard;
       
        if(ctx.chat) {
            const user = await UserModel.findOne({ chatId: ctx.chat?.id });
            const team = await teamModel.findById(user?.team);
            const teamInfo = await getTeamInfo(team);
            console.log(currentSceneKeyboard)
            if(currentStage == "competition-menu-wizard") {
                await ctx.reply(teamInfo, teamCompetitionboard);
            }
            else{
                await ctx.reply(teamInfo, teamProfileAfterApprove);
            }
          

        }    
    },
    async (ctx) => {
        if (ctx.message) {
            let testTask;
            const user = await UserModel.findOne({ chatId: ctx.chat?.id });
            const team = await teamModel.findById(user?.team);
            
            // Перевірка, чи є повідомлення файлом (наприклад, PDF)
            if (isDocumentMessage(ctx.message) && team?.category ===  "Case Study") {
                const fileId = ctx.message.document.file_id;
                const fileLink = await ctx.telegram.getFileLink(fileId);
                testTask = fileLink.href; // Зберігаємо посилання на файл як testTask
            }
            else if(isTextMessage(ctx.message) && team?.category === "Team Design") {
                testTask = ctx.message.text.trim();
            }
            else {
                await ctx.reply("Ви відправили некоректний формат, спробуйте ще раз");
                return ctx.wizard.selectStep(1); 
            }

    
            if (team) {
                team.testTask = testTask; 
                await team.save();
            } else {
                await ctx.reply("Виникла помилка");
            }
            console.log("fsfd")
            return ctx.scene.enter('my-team-joined-menu-wizard');  
        }
    },
    async (ctx) => {
        if (isTextMessage(ctx.message)) {
            const listTechnology = ctx.message.text.trim();
            if(ctx.chat) {
                const user = await UserModel.findOne({ chatId: ctx.chat.id });
                const team = await teamModel.findById(user?.team);
                if (team) {
                    team.technologyList = listTechnology;
                    await team.save();  // Збереження змін в базі даних
                } else {
                    await ctx.reply("Виникла помилка");
                }
                return ctx.scene.enter('my-team-joined-menu-wizard');  
            }
        }
    },
    async (ctx) => {
        if(ctx.message) {
            if (isDocumentMessage(ctx.message)) {
                const document = ctx.message.document;

                if (document.mime_type === 'application/pdf') {
                    const user = await UserModel.findOne({ chatId: ctx.chat?.id });
                    if (user) {
                        user.cv = document.file_id;
                        
                        await user.save();
                        await ctx.reply("Ваше CV отримано та збережено!");
                        return ctx.scene.enter('my-team-joined-menu-wizard');  
                    }
                } else {
                    await ctx.reply("Будь ласка, надішліть PDF файл.");
                }
            } else {
                await ctx.reply("Будь ласка, надішліть документ у форматі PDF.");
            }
        }
    },
    async (ctx) => {
        if (isTextMessage(ctx.message)) {
            const option = ctx.message.text.trim();
            if(option === workingOption[1]) {
                return ctx.scene.enter('my-team-joined-menu-wizard');  
            }
            else if(option === workingOption[0]) {
                const user = await UserModel.findOne({ chatId: ctx.chat?.id });
                if (user) {
                    await teamModel.updateOne(
                        { _id: user.team }, // фільтр для вибору команди
                        { $pull: { members: user._id } } // видаляємо користувача з масиву members
                    );
                    user.team = null;
                    user.save();
                    await ctx.reply("Ви успішно покинули команду");
                    return ctx.scene.enter('my-team-menu-wizard'); 
                }
                else {
                    return ctx.scene.enter('my-team-joined-menu-wizard');  
                }
            }
           
        }
    }
        

);

myTeamJoinedMenuWizard.hears(teamProfileOption[0], async (ctx) => {
        return ctx.scene.enter(currentStage, currentSceneKeyboard);  
})

    myTeamJoinedMenuWizard.hears(teamProfileOption[1], async (ctx) => {
        if(currentStage !== "after-approve-menu-wizard") {
            const user = await UserModel.findOne({ chatId: ctx.chat.id });
            const team = await teamModel.findById(user?.team);
            if(team?.category === "Team Design") {
                await ctx.reply("Введи посилання на ваш проєкт в Tinkercad'i");
            }
            else if (team?.category === "Case Study") {
                await ctx.reply("Завантажте у чат pdf-файл з вашим завданням");
            }
        
            ctx.wizard.selectStep(1);
        }
    })
    myTeamJoinedMenuWizard.hears(teamProfileOption[2], async (ctx) => {
        if(currentStage !== "after-approve-menu-wizard") {
            await ctx.reply("Введіть технології якими володіє ваша команда");
            ctx.wizard.selectStep(2);
        }
        
    })
    myTeamJoinedMenuWizard.hears(teamProfileOption[4], async (ctx) => {
        if(currentStage !== "after-approve-menu-wizard") {
            await ctx.reply("Тестового завдання ще нема, очікуйте в майбутньому");
            const filePath = path.resolve(__dirname, "C:/Users/Admin/Downloads/file_0.pdf");
            if(ctx.chat) {
                await ctx.reply("Тестове завдання готове!\nОсь посилання на умови завдання: ");
                await ctx.telegram.sendDocument(ctx.chat.id, { source: filePath });
            }    
            ctx.message.text = "";
           return ctx.scene.enter('my-team-joined-menu-wizard'); 
        }  
    })
    
    myTeamJoinedMenuWizard.hears(teamProfileOption[5], async (ctx) => {
        if(currentStage !== "after-approve-menu-wizard") {
            await ctx.reply("Чи точно ви хочете покинути команду?", workingInlineButton);
            ctx.wizard.selectStep(4);   
        }
    })

    myTeamJoinedMenuWizard.hears(teamCompetitionOption[2], async (ctx) => {
        if(currentStage == "competition-menu-wizard") {
            await ctx.sendDocument({ source: './public/file_3.pdf' });
        }
    })
    myTeamJoinedMenuWizard.hears(teamCompetitionOption[3], async (ctx) => {
        if(currentStage == "competition-menu-wizard") {
            let contacts = "Ось вам контакти організаторів:\n"
            contacts += "Руслан Явір - @Shiza1705\n"
            contacts += "Братюк Владислав - @bratiuk\n"
            contacts += "Кичма Лілія - @lilaaaaaaaaa\n"

            await ctx.reply(contacts);
        }
    })

myTeamJoinedMenuWizard.hears(teamProfileOption[3], async (ctx) => {
    await ctx.reply("Надішліть своє CV у вигляді PDF-файлу");
    ctx.wizard.selectStep(3);   
})





export default myTeamJoinedMenuWizard;

