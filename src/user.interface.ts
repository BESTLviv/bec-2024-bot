import { Contact } from "telegraf/typings/core/types/typegram";

export interface IUser {
    chatId: number;
    name: string;
    age: number;
    specialization: string;
    where: string;
    education: string;
    isWorking: boolean;
    course: string;
    email: string;
    contact: Contact
}