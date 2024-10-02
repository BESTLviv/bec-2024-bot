

import axios from 'axios';
import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { IBotContext } from '../context/context.interface';

// Інтерфейс для резюме
interface IResumeData {
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

export const generatePDF = async (ctx: IBotContext, resume: IResumeData) => {
    const doc = new PDFDocument({   
        size: 'A4',
        margin: 50
    });
    
    const filePath = path.join(__dirname, `${ctx.from?.id}_resume.pdf`);

    // Задаємо шрифт, який підтримує українські символи
    const fontPath = path.join(__dirname, '../../public/fonts/OpenSans.ttf');
    doc.font(fontPath); // Використовуємо шрифт

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // Стиль заголовків та підзаголовків
    const headerColor = '#4A7836';
    const subHeaderColor = '#1D1D1D';

    // Ліва колонка (особисті дані)
    doc.rect(0, 0, 200, doc.page.height).fill(headerColor).fillColor('white');

    // Фото
    // const imagePath = path.join(__dirname, '../../public/WhatIsBest.jpg'); // шлях до фото
    const imagePath = path.join(__dirname, 'photo.jpg');

    // Завантаження зображення з URL
    await downloadImage(resume.personalInfo.photoUrl, imagePath);
    
    // Вставка зображення у PDF
    doc.image(imagePath, 50, 50, { width: 100, height: 100 });

    // Особисті дані
    doc.fontSize(14).text(resume.personalInfo.fullName, 20, 160, { align: 'center', width: 160 });
    doc.moveDown(1);

    doc.fontSize(10).text(resume.personalInfo.location,{ align: 'center', width: 160 });
    doc.moveDown(1);

    doc.text('Номер телефону', { align: 'center', width: 160 });
    doc.text(resume.personalInfo.phone, { align: 'center', width: 160 });
    doc.moveDown(1);

    doc.text('Email',  { align: 'center', width: 160 });
    doc.text(resume.personalInfo.email,  { align: 'center', width: 160 });
    doc.moveDown(1);

    doc.text('Дата народження',  { align: 'center', width: 160 });
    doc.text(resume.personalInfo.birthDate,  { align: 'center', width: 160 });
    doc.moveDown(1);

    doc.text('LinkedIn',  { align: 'center', width: 160 });
    doc.text(resume.personalInfo.linkedIn,  { align: 'center', width: 160 });

    // Права колонка (кваліфікація, досвід роботи та ін.)
    doc.fillColor('black').fontSize(14);

    doc.fillColor(subHeaderColor).fontSize(16).text('Про мене', 220, 50);
    doc.fontSize(12).text(resume.qualification, 220, 80, { align: 'justify', width: 350 });
    doc.moveDown(1);

    doc.fillColor(subHeaderColor).fontSize(16).text('Досвід роботи', { underline: true });
    doc.moveDown(0.5);

    // Досвід роботи
    resume.workExperience.forEach((experience) => {
        doc.fontSize(12).fillColor('black').text(experience.position, { align: 'left' });
        doc.fontSize(10).fillColor('gray').text(`${experience.company}, ${experience.location}`, { align: 'left' });
        doc.text(experience.dateRange, { align: 'left' });
        doc.moveDown(0.3);
        experience.responsibilities.forEach((responsibility) => {
            doc.fillColor('black').text(`• ${responsibility}`);
        });
        doc.moveDown(1);
    });

    // Освіта
    doc.fillColor(subHeaderColor).fontSize(16).text('Освіта', { underline: true });
    doc.moveDown(0.5);

    resume.education.forEach((edu) => {
        doc.fontSize(12).fillColor('black').text(`${edu.degree}, ${edu.institution}`, { align: 'left' });
        doc.fontSize(10).fillColor('gray').text(edu.dateRange, { align: 'left' });
        doc.moveDown(1);
    });

    // Навички
    doc.fillColor(subHeaderColor).fontSize(16).text('Навички', { underline: true });
    doc.moveDown(0.5);

    resume.skills.forEach((skill) => {
        doc.fontSize(12).fillColor('black').text(`• ${skill}`);
    });
    doc.moveDown(1);

    // Завершення документа
    doc.end();

    // Чекаємо на завершення запису
    await new Promise((resolve) => writeStream.on('finish', resolve));

    return filePath;
};

async function downloadImage(url: any, filepath: any) {
    const response = await axios({
        url,
        responseType: 'stream',
    });
    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}