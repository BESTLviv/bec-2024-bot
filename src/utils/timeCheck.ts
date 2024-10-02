import { IBotContext } from "../context/context.interface";

export async function TimeCheck(ctx: IBotContext) {
    if(ctx.session.userLastMessageTime === undefined) {
        ctx.session.userLastMessageTime = {};
    }

    if(ctx.from) {
        const userId = ctx.from.id;
        const now = Date.now();
    
        if (!ctx.session.userLastMessageTime[userId] || (now - ctx.session.userLastMessageTime[userId] > 1000)) {
            ctx.session.userLastMessageTime[userId] = now;
        } else {
            throw  new Error("Забагато спроб");
        }
    }
    else {
        console.log("mnooo")
    }
  
}
