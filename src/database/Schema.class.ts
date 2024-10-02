import { Schema, Types, model } from 'mongoose';
import { ObjectId } from "mongodb";
import { Document } from 'mongoose';
import { link } from 'telegraf/typings/format';

export interface IUser extends Document {
    chatId: number;
    userName: string;
    isRegistered: boolean;
    cv: string;
    isTeam: boolean;
    isParticipant: boolean;
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
    team: Types.ObjectId | null; // ObjectId referencing the 'teams' collection or null
}

export interface ITeam extends Document {
    name: string;
    category: string;
    password: string;
    members: Types.ObjectId[]; // Array of ObjectIds referencing 'users' collection
    technologyList: string;
    testTask: string;
    repository: string;
    isSendTest: boolean;
    isApprove: boolean;
}

const UserSchema = new Schema({
    chatId: Number,
    userName: String,
    isRegistered: Boolean,
    cv: String,
    isParticipant: Boolean,
    subInfo: {
        age: Number,
        education: String,
        course: String,
        specialization: String,
        where: String,
        isWorking: String,
        email: String,
        phone: String,
    },
    team: { type: Schema.Types.ObjectId, ref: 'teams' },
});

const teamSchema = new Schema({
    name: String,
    category: String,
    password: String,
    members: [{ type: Schema.Types.ObjectId, ref: 'users' }],
    technologyList: String,
    testTask: String || Document,
    isSendTest: Boolean,
    isApprove: Boolean,
});

const currentStageSchema = new Schema({
    name: String,
    isTestReady: Boolean,
    linkForTest: String,
    rulesDoc: String
});

export const UserModel = model('User', UserSchema, "users");
export const teamModel = model('Team', teamSchema, "teams");
export const currentStageModel = model('CurrentStage', currentStageSchema, "currentStage");