import { vk } from './vk';

import { registerScenes } from "./scenes";

import { registerMessageHandler } from "./handlers/message.handler";
import { registerChatMessageHandler } from "./handlers/chatMessage.handler";
import { registerEventHandler } from "./handlers/event.handler";

registerScenes();

export async function startBot() {
    registerMessageHandler();
    registerChatMessageHandler();
    registerEventHandler();

  await vk.updates.start();

  console.log("VK bot started");
}
