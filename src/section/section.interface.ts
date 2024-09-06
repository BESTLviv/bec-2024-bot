import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";

export interface Section {
    ctx: IBotContext;
    bot: Telegraf<IBotContext>;

    handle(): void
}