import { config, DotenvParseOutput } from "dotenv";
import { IConfigService } from "./config.interface";

export class ConfigService implements IConfigService {
    private config: DotenvParseOutput;
    constructor() {
        const { error, parsed} = config();
        if(error) {
            throw new Error("Don`t find file .env")
        }
        if(!parsed) {
            throw new Error("Empty file .env")
        }
        this.config = parsed;
    }

    get(key: string): string {
        const res = this.config[key];
        if(!res) {
            throw new Error("There is no such key")
        }
        return res;
    }
}