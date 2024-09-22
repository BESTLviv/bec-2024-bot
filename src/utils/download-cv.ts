import axios from 'axios';
import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { IBotContext } from '../context/context.interface';

// Типи для параметрів функцій
type FileLink = string;

// Функція для завантаження файлу з URL
export async function downloadFile(url: string, filePath: string): Promise<void> {
  const response = await axios({ url, responseType: 'stream' });
  response.data.pipe(fs.createWriteStream(filePath));
  return new Promise((resolve, reject) => {
    response.data.on('end', resolve);
    response.data.on('error', reject);
  });
}

// Функція для створення архіву
async function createZip(files: string[], zipPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);

    files.forEach(file => archive.file(file, { name: path.basename(file) }));

    archive.finalize();
  });
}

// Основна функція для обробки і відправки архіву
export async function handleFilesAndSendArchive(ctx: IBotContext, fileLinks: FileLink[]): Promise<void> {
  const tempDir = './temp';
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  const tempFiles: string[] = [];
  for (const fileLink of fileLinks) {
    const fileName = path.basename(new URL(fileLink).pathname);
    const filePath = path.join(tempDir, fileName);
    await downloadFile(fileLink, filePath);
    tempFiles.push(filePath);
  }

  const zipPath = path.join(tempDir, 'CVs.zip');
  await createZip(tempFiles, zipPath);

  if(ctx.chat) {
      await ctx.telegram.sendDocument(ctx.chat.id, { source: zipPath });
  }

  // Очистка тимчасових файлів
  tempFiles.forEach(file => fs.unlinkSync(file));
  fs.unlinkSync(zipPath);
}
