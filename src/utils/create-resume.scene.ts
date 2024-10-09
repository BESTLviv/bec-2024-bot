import { IBotContext } from "../context/context.interface";
import { Scenes } from "telegraf";
import { getSceneAndKeyboard, isDocumentMessage, isPhotoMessage, isTextMessage } from "./generaly-utils.functions";
import { resumeOption } from "../markups/after-registration.class";
import { UserModel } from "../database/Schema.class";
import { generatePDF } from "./generate-pdf";
// import { downloadFile } from "./download-cv";
import * as fs from 'fs';
import { TimeCheck } from "./timeCheck";
import axios from "axios";
import path from "path";

// Об'єкт резюме для заповнення

// Функція для завантаження файлу
const downloadFile = async (url: any, localPath: any) => {
  const writer = fs.createWriteStream(localPath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });
  
  response.data.pipe(writer);
  
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
};
// let currentSceneKeyboard: any;
// let currentStage: string;

// Сцена заповнення резюме
const createResumeWizard = new Scenes.WizardScene<IBotContext>(
  'create-resume-wizard',

  async (ctx) => {
    try{
      const { keyboard, scene } = await getSceneAndKeyboard(ctx);
      ctx.session.currentStage = scene;
      ctx.session.currentSceneKeyboard = keyboard;
      await ctx.reply('Вибери одну з кнопок:');
    }
    catch (error) {
        return;
    }
   
  },
  async (ctx) => {
    try{
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
    }
    catch (error) {
        return;
    }
    
    },
  // Крок 2: Отримуємо повне ім'я та запитуємо місцезнаходження
  async (ctx) => {
    try{
      ctx.session.resume = {
        personalInfo: {
          photoUrl: '',
          fullName: '',
          location: '',
          phone: '',
          email: '',
          birthDate: '',
          maritalStatus: '',
          linkedIn: '',
        },
        qualification: '',
        workExperience: [],
        education: [],
        skills: [],
      };
  
      if (isTextMessage(ctx.message)) {
        ctx.session.resume.personalInfo.fullName = ctx.message.text.trim();
        await ctx.reply('Введіть ваше місцезнаходження:');
        return ctx.wizard.next();
      }
      await ctx.reply('Будь ласка, введіть текст.');
    }
    catch (error) {
        return;
    }
    
  },

  // Крок 3: Отримуємо місцезнаходження та запитуємо телефон
  async (ctx) => {
    try{
      if (isTextMessage(ctx.message)) {
        ctx.session.resume.personalInfo.location = ctx.message.text.trim();
        await ctx.reply('Введіть ваш номер телефону:');
        return ctx.wizard.next();
      }
      await ctx.reply('Будь ласка, введіть текст.');
    }
    catch (error) {
        return;
    }
   
  },

  // Крок 4: Отримуємо телефон та запитуємо email
  async (ctx) => {
    try{
      if (isTextMessage(ctx.message)) {
        ctx.session.resume.personalInfo.phone = ctx.message.text.trim();
        await ctx.reply('Введіть ваш email:');
        return ctx.wizard.next();
      }
      await ctx.reply('Будь ласка, введіть текст.');
    }
    catch (error) {
        return;
    }
    
  },

  // Крок 5: Отримуємо email та запитуємо дату народження
  async (ctx) => {
    try{
      if (isTextMessage(ctx.message)) {
        ctx.session.resume.personalInfo.email = ctx.message.text.trim();
        await ctx.reply('Введіть вашу дату народження (дд-мм-рррр):');
        return ctx.wizard.next();
      }
      await ctx.reply('Будь ласка, введіть текст.');
    }
    catch (error) {
        return;
    }
    
  },

  // Крок 6: Отримуємо дату народження та запитуємо сімейний стан
  async (ctx) => {
    try{
      if (isTextMessage(ctx.message)) {
        ctx.session.resume.personalInfo.birthDate = ctx.message.text.trim();
        await ctx.reply('Введіть ваш профіль LinkedIn(якщо нема то ставте \'-\'):');
        return ctx.wizard.next();
      }
      await ctx.reply('Будь ласка, введіть текст.');
    }
    catch (error) {
        return;
    }
   
  },

  // Крок 8: Отримуємо LinkedIn та запитуємо кваліфікацію
  async (ctx) => {
    try{
      if (isTextMessage(ctx.message)) {
        ctx.session.resume.personalInfo.linkedIn = ctx.message.text.trim();
        await ctx.reply('Напишіть коротко про вас, яку спеціальність бажаєте:');
        return ctx.wizard.next();
      }
      await ctx.reply('Будь ласка, введіть текст.');
    }
    catch (error) {
        return;
    }
    
  },

// Крок 9: Отримуємо кваліфікацію та запитуємо досвід роботи
async (ctx) => {
  try{
    if (isTextMessage(ctx.message)) {
      ctx.session.resume.qualification = ctx.message.text.trim();
      await ctx.reply('Введіть досвід роботи через кому (позиція, компанія, локація, дати, обов\'язки на цій посаді) або напишіть "стоп" для завершення:');
      return ctx.wizard.next();
    }
    await ctx.reply('Будь ласка, введіть текст.');
  }
  catch (error) {
      return;
  }
    
  },
  
  // Крок 10: Обробляємо досвід роботи і дозволяємо вводити кілька місць праці
  async (ctx) => {
    try{
      if (isTextMessage(ctx.message)) {
        const message = ctx.message.text.trim();
        
        // Перевіряємо, чи користувач ввів слово "стоп"
        if (message.toLowerCase() === 'стоп') {
          await ctx.reply('Введення досвіду роботи завершено.');
          await ctx.reply('Введіть освіту (ступінь, навчальний заклад, дати) або напишіть "стоп" для завершення:');
          return ctx.wizard.next();
        }
    
        // Перевіряємо, чи є у введеному тексті коми
        if (!message.includes(',')) {
          await ctx.reply('Будь ласка, введіть дані через кому (позиція, компанія, локація, дати, обов\'язки на цій посаді).');
          return;
        }
    
        // Розділяємо введені дані про місце праці
        const workData = message.split(',');
        if (workData.length < 5) {
          await ctx.reply('Будь ласка, введіть всі дані про досвід роботи (позиція, компанія, локація, дати, обов\'язки на цій посаді).');
          return;
        }
    
        // Додаємо запис про досвід роботи в резюме
        ctx.session.resume.workExperience.push({
          position: workData[0].trim(),
          company: workData[1].trim(),
          location: workData[2].trim(),
          dateRange: workData[3].trim(),
          responsibilities: workData.slice(4).map((resp) => resp.trim()),
        });
    
        // Запитуємо, чи хоче користувач додати ще одне місце праці
        await ctx.reply('Досвід роботи збережено. Ви можете додати ще одне місце праці або напишіть "стоп" для завершення:');
      } else {
        await ctx.reply('Будь ласка, введіть текст.');
      }
    }
    catch (error) {
        return;
    }
    
  },
  
  // Крок 11: Отримуємо та обробляємо введення освіти
  async (ctx) => {
    try{
      if (isTextMessage(ctx.message)) {
        const message = ctx.message.text.trim();
    
        // Перевіряємо, чи користувач ввів слово "стоп"
        if (message.toLowerCase() === 'стоп') {
          await ctx.reply('Введення освіти завершено.');
          await ctx.reply('Введіть ваші навички через кому:');
          return ctx.wizard.next();
        }
    
        // Перевіряємо, чи є у введеному тексті коми
        if (!message.includes(',')) {
          await ctx.reply('Будь ласка, введіть дані через кому (ступінь, навчальний заклад, дати).');
          return;
        }
    
        // Розділяємо введені дані про освіту
        const educationData = message.split(',');
        if (educationData.length < 3) {
          await ctx.reply('Будь ласка, введіть всі дані про освіту (ступінь, навчальний заклад, дати).');
          return;
        }
    
        // Додаємо запис про освіту в резюме
        ctx.session.resume.education.push({
          degree: educationData[0].trim(),
          institution: educationData[1].trim(),
          dateRange: educationData[2].trim(),
        });
    
        // Запитуємо, чи хоче користувач додати ще один запис про освіту
        await ctx.reply('Освіта збережена. Ви можете додати ще одну освіту або напишіть "стоп" для завершення:');
      } else {
        await ctx.reply('Будь ласка, введіть текст.');
      }
    }
    catch (error) {
        return;
    }
    
  },
  
 // Крок 12: Отримуємо навички та завершуємо
async (ctx) => {
  try{
    if (isTextMessage(ctx.message)) {
      const message = ctx.message.text.trim();
  
      // Перевіряємо, чи є у введеному тексті коми
      if (!message.includes(',')) {
        await ctx.reply('Будь ласка, введіть навички через кому.');
        return;
      }
  
      // Розділяємо навички і додаємо їх у резюме
      ctx.session.resume.skills = message.split(',').map((skill) => skill.trim());
  
      await ctx.reply('І останнє, надішліть своє фото');

      // await ctx.replyWithDocument({ source: await generatePDF(ctx, resume), filename: `${ctx.from?.id}_resume.pdf` });
      return ctx.wizard.next();
    }
    await ctx.reply('Будь ласка, введіть текст.');
  }
  catch (error) {
      return;
  }
    
  },
  async (ctx) => {
    try {
      if (isPhotoMessage(ctx.message)) {
        // Отримуємо останню версію фото (найбільшу за розміром)
        const photo = ctx.message.photo[ctx.message.photo.length - 1].file_id;
        const fileLink = await ctx.telegram.getFileLink(photo);
        
        // Отримуємо розширення файлу з URL
        const fileExtension = path.extname(fileLink.href) || '.jpg'; // Якщо не вдалося отримати розширення, за замовчуванням використовуємо .jpg
        const photoFilePath = path.join(__dirname, `${ctx.from?.id}_photo${fileExtension}`);
        
        try {
          // Завантажуємо фото на локальну машину
          await downloadFile(fileLink.href, photoFilePath);
          
          // Зберігаємо посилання на фото в сесію
          ctx.session.resume.personalInfo.photoUrl = fileLink.href;
          
          // Інформуємо користувача про завершення
          await ctx.reply("Створення резюме завершено! Тепер оберіть кнопку надіслати готове резюме і відправте цей PDF-файл.");
          
          // Генеруємо PDF-файл
          const pdfFilePath = await generatePDF(ctx, ctx.session.resume);
          
          // Відправляємо PDF-файл користувачу
          await ctx.replyWithDocument({ source: pdfFilePath, filename: `${ctx.from?.id}_resume.pdf` });
          
          // Видаляємо локально збережене фото
          fs.unlink(photoFilePath, (err) => {
            if (err) {
              console.error('Помилка під час видалення фото:', err);
            } else {
              console.log('Фото успішно видалене');
            }
          });
          
          // Видаляємо локально збережений PDF-файл
          fs.unlink(pdfFilePath, (err) => {
            if (err) {
              console.error('Помилка під час видалення PDF-файлу:', err);
            } else {
              console.log('PDF-файл успішно видалений');
            }
          });
          
          // Переходимо до наступної сцени
          return ctx.scene.enter("create-resume-wizard");
        } catch (error) {
          console.error('Помилка під час завантаження або відправки файлів:', error);
          await ctx.reply('Сталася помилка під час створення резюме. Спробуйте ще раз.');
        }
      } else {
        await ctx.reply('Будь ласка, надішліть фото, а не файл.');
      }
    } catch (error) {
      console.error('Загальна помилка:', error);
      await ctx.reply('Виникла неочікувана помилка. Спробуйте ще раз.');
    }
    
  },

  
);

createResumeWizard.hears(resumeOption[0], async (ctx) => {
    try{
      await TimeCheck(ctx)
      await ctx.reply('Надішліть своє CV у вигляді PDF-файлу');
      ctx.wizard.selectStep(1);   
    }
    catch(error) {
        return;
    }
   
})
createResumeWizard.hears(resumeOption[1], async (ctx) => {
  try{
    await TimeCheck(ctx)
    await ctx.reply('Введіть своє ПІБ');
    ctx.wizard.selectStep(2);  
  }
  catch(error) {
      return;
  }
     
})
createResumeWizard.hears(resumeOption[2], async (ctx) => {
  try{
    await TimeCheck(ctx)
    const user = await UserModel.findOne({ chatId: ctx.chat?.id });

  if (user && user.cv) {
    const fileId = user.cv; // file_id з Telegram, а не URL
    const filePath = path.join(__dirname, `/${ctx.chat?.id}_cv.pdf`); // Шлях, куди буде збережено файл

    try {
      // Отримуємо фактичне посилання на файл за допомогою Telegram API
      const fileLink = await ctx.telegram.getFileLink(fileId);

      // Завантажуємо файл за URL
      await downloadFile(fileLink.href, filePath);

      // Відправляємо файл у чат
      if (ctx.chat) {
        await ctx.telegram.sendDocument(ctx.chat.id, { source: filePath });
      } else {
        await ctx.reply('Сталася помилка під час завантаження файлу. Спробуйте ще раз.');
        return;
      }
      
      // Видаляємо файл після відправки
      fs.unlinkSync(filePath);

    } catch (error) {
      console.error(error);
      await ctx.reply('Сталася помилка під час завантаження файлу. Спробуйте ще раз.'); 
      return;
    }
  } else {
    await ctx.reply('У вас не завантажений файл з резюме');
    return;
  }  
  }
  catch(error) {
      return;
  }
  
});
createResumeWizard.hears(resumeOption[3], async (ctx) => {
  return ctx.scene.enter(ctx.session.currentStage, ctx.session.currentSceneKeyboard);  
})
// Експорт сцени
export default createResumeWizard;
 