import { vk } from '../vk';

const rawGroupId = Number(process.env.OWNER_GROUP_ID);
const groupId = Math.abs(rawGroupId);

const mentionRegex = new RegExp(`\\[club${groupId}\\|[^\\]]+\\]`, 'gi');

function stripBotMention(text: string): string {
    return text.replace(mentionRegex, '').trim();
}

export function registerChatMessageHandler() {
    vk.updates.on('message_new', async (ctx, next) => {
        if (!ctx.isChat) {
            return next();
        }

        if (!ctx.hasText) {
            return next();
        }

        const text = ctx.text || '';
        const mentioned = text.includes(`[club${groupId}|`);

        if (!mentioned) {
            return next();
        }

        if (!await checkUserRegistration(ctx.senderId)) {
            ctx.send(`[id${ctx.senderId}|ответ для вас]\nДля начала войдите или зарегистрируйтесь в системе`)
            return next();
        }

        const clearText = stripBotMention(text).trim();

        const response = await $fetch("/api/miniapp/QA", {
            method: "POST",
            body: {
                userId: ctx.senderId,
                question: clearText,
            },
            keepalive: true,
        });

        const userMention = `[id${ctx.senderId}|ответ для вас]`;

        ctx.send(`${userMention}\n\n${response}`)

        //LOG Обработка сообщений в беседе
    });
}